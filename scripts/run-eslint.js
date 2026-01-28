/* eslint-disable @typescript-eslint/no-require-imports */

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

function sanitizeMessage(text) {
  if (!text) return '';
  return String(text)
    .replace(/\u00b7/g, ' ') // middot used by prettier messages
    .replace(/\u23ce/g, '\\n') // ⏎
    .replace(/\u240d/g, '[CR]') // ␍
    .replace(/\r\n/g, '\\n')
    .replace(/\r/g, '\\n');
}

function formatIssue(issue) {
  const severity = issue.severity === 2 ? 'error' : 'warn';
  const rule = issue.ruleId || 'unknown-rule';
  const message = sanitizeMessage(issue.message);
  return `${issue.line || 0}:${issue.column || 0}  ${severity}  ${rule}  ${message}`;
}

function main() {
  const repoRoot = process.cwd();
  const eslintBin = path.join(repoRoot, 'node_modules', 'eslint', 'bin', 'eslint.js');
  const outputFile = path.join(repoRoot, 'lint-output.json');

  const userArgs = process.argv.slice(2);

  // If the user provides explicit targets (non-flag args), respect them.
  const userTargets = userArgs.filter(a => a && !a.startsWith('-'));
  const userFlags = userArgs.filter(a => a && a.startsWith('-'));

  // Default lint scope: only app/source code.
  // This keeps CI/dev lint useful and avoids flagging one-off scripts, dev archives,
  // generated files, and public assets.
  const defaultTargets = ['pages', 'components', 'lib', 'utils', 'config', 'middleware.js'];
  const resolvedDefaultTargets = defaultTargets.filter(p => fs.existsSync(path.join(repoRoot, p)));
  const targets = userTargets.length > 0 ? userTargets : resolvedDefaultTargets;

  // Run ESLint without printing to the console (avoids Windows fast-fail crash
  // triggered by certain Unicode characters in prettier error messages).
  const eslintArgs = [
    eslintBin,
    '--format',
    'json',
    '--output-file',
    outputFile,
    '--ext',
    '.js,.jsx,.ts,.tsx',
    ...targets,
    ...userFlags,
  ];

  // Prevent stale results when ESLint crashes before rewriting the report.
  try {
    if (fs.existsSync(outputFile)) fs.unlinkSync(outputFile);
  } catch {
    // If deletion fails (e.g., file locked), we'll still attempt to run ESLint.
  }

  const result = spawnSync('node', eslintArgs, {
    cwd: repoRoot,
    stdio: 'pipe',
    windowsHide: true,
  });

  let parsed = null;
  try {
    if (fs.existsSync(outputFile)) {
      const raw = fs.readFileSync(outputFile, 'utf8');
      parsed = JSON.parse(raw);
    }
  } catch {
    // Keep output minimal & ASCII-safe.
    process.stderr.write(`ESLint: failed to read ${path.basename(outputFile)}\n`);
  }

  if (!Array.isArray(parsed)) {
    process.stderr.write(`ESLint: node ${sanitizeMessage(eslintArgs.join(' '))}\n`);
    if (result.error) {
      process.stderr.write(
        `ESLint: runner failed to start (${sanitizeMessage(result.error.message)})\n`
      );
    }
    const stderrText = result.stderr ? sanitizeMessage(result.stderr.toString('utf8')) : '';
    const stdoutText = result.stdout ? sanitizeMessage(result.stdout.toString('utf8')) : '';
    if (stderrText.trim()) {
      process.stderr.write(
        stderrText.slice(0, 2000) + (stderrText.length > 2000 ? '\n...truncated\n' : '')
      );
    }
    if (stdoutText.trim()) {
      process.stdout.write(
        stdoutText.slice(0, 2000) + (stdoutText.length > 2000 ? '\n...truncated\n' : '')
      );
    }
    process.stderr.write('ESLint: no report produced (see lint-output.json if present)\n');
    process.exitCode = typeof result.status === 'number' ? result.status : 1;
    return;
  }

  let errorCount = 0;
  let warningCount = 0;
  let fileCount = 0;

  const lines = [];

  for (const fileResult of parsed) {
    const messages = Array.isArray(fileResult.messages) ? fileResult.messages : [];
    if (messages.length === 0) continue;
    fileCount += 1;

    for (const msg of messages) {
      if (msg.severity === 2) errorCount += 1;
      else if (msg.severity === 1) warningCount += 1;

      const relPath = fileResult.filePath
        ? path.relative(repoRoot, fileResult.filePath)
        : '(unknown-file)';
      lines.push(`${relPath}:${formatIssue(msg)}`);
    }
  }

  process.stdout.write(
    `ESLint: ${errorCount} errors, ${warningCount} warnings in ${fileCount} files\n`
  );

  const maxLines = 200;
  for (const line of lines.slice(0, maxLines)) {
    process.stdout.write(`${sanitizeMessage(line)}\n`);
  }

  if (lines.length > maxLines) {
    process.stdout.write(`... and ${lines.length - maxLines} more\n`);
    process.stdout.write(`(Full JSON report: ${path.basename(outputFile)})\n`);
  }

  // If ESLint wrote a valid report, trust it.
  // Some Windows shells/task runners may surface a nonzero process status even when ESLint
  // succeeded and produced zero issues.
  if (typeof result.status === 'number' && result.status !== 0 && errorCount === 0) {
    process.stdout.write(
      `ESLint: note: underlying exit status was ${result.status}, using report results\n`
    );
  }

  // ESLint on Windows can occasionally crash (e.g. with a nonzero/AccessViolation-like
  // exit status) even though it successfully wrote the JSON report.
  // Gate on actual lint errors from the report to keep CI/deploy stable.
  process.exitCode = errorCount > 0 ? 1 : 0;
}

main();
