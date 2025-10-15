/* eslint-disable prettier/prettier */
/* eslint-disable linebreak-style */
import fs from 'fs';
import path from 'path';

const STATUS_FILENAME = 'car-status.json';
const DATA_DIR = path.join(process.cwd(), 'data');
const TMP_DIR = process.env.TMPDIR || process.env.TEMP || '/tmp';

function getRepoStatusPath() {
  return path.join(DATA_DIR, STATUS_FILENAME);
}

function getWritableStatusPath() {
  // On Vercel, only /tmp is writable at runtime
  if (process.env.VERCEL) {
    return path.join(TMP_DIR, STATUS_FILENAME);
  }
  return getRepoStatusPath();
}

export function readCarStatuses() {
  const candidates = [];
  if (process.env.VERCEL) {
    candidates.push(path.join(TMP_DIR, STATUS_FILENAME));
  }
  candidates.push(getRepoStatusPath());

  for (const filePath of candidates) {
    try {
      if (fs.existsSync(filePath)) {
        const raw = fs.readFileSync(filePath, 'utf8');
        if (raw && raw.trim().length > 0) {
          return JSON.parse(raw);
        }
      }
    } catch {
      // ignore parse errors
    }
  }

  return {};
}

export function writeCarStatuses(statuses) {
  const targetPath = getWritableStatusPath();
  const dir = path.dirname(targetPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(targetPath, JSON.stringify(statuses, null, 2), 'utf8');
  return targetPath;
}

export function updateCarStatus(carId, status) {
  if (!carId) throw new Error('carId is required');
  const statuses = readCarStatuses();
  statuses[carId] = { status, updatedAt: new Date().toISOString() };
  const pathWritten = writeCarStatuses(statuses);
  return { statusRecord: statuses[carId], path: pathWritten };
}
