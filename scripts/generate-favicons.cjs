/* eslint-disable prettier/prettier, @typescript-eslint/no-require-imports */

// Generates favicon PNG sizes and a multi-size favicon.ico from a source image.
// Usage:
//   node scripts/generate-favicons.cjs --src public/logo/logo_favicon.webp

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

function parseArgs(argv) {
  const args = { src: null };
  for (let i = 0; i < argv.length; i += 1) {
    const a = argv[i];
    if (a === '--src') args.src = argv[i + 1];
  }
  return args;
}

function ensureDir(filePath) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

async function writeImageFile({ outPath, srcPath, pipeline }) {
  ensureDir(outPath);

  const outResolved = path.resolve(outPath);
  const srcResolved = path.resolve(srcPath);

  // sharp refuses to use the same file for input/output; allow overwriting via buffer.
  if (outResolved === srcResolved) {
    const buf = await pipeline.toBuffer();
    fs.writeFileSync(outResolved, buf);
    return;
  }

  await pipeline.toFile(outResolved);
}

/**
 * Write an ICO that embeds PNG images (modern ICO, supported by Windows/Chrome/Google).
 * @param {Array<{size:number, png:Buffer}>} images
 * @returns {Buffer}
 */
function buildIco(images) {
  // ICO header (6 bytes)
  // 0-1: reserved = 0
  // 2-3: type = 1
  // 4-5: count
  const count = images.length;
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(count, 4);

  // Directory entries (16 bytes each)
  const dir = Buffer.alloc(16 * count);

  let offset = 6 + 16 * count;
  const chunks = [header, dir];

  images.forEach((img, idx) => {
    const entryOffset = idx * 16;
    const size = img.size;
    const w = size === 256 ? 0 : size;
    const h = size === 256 ? 0 : size;

    dir.writeUInt8(w, entryOffset + 0); // width
    dir.writeUInt8(h, entryOffset + 1); // height
    dir.writeUInt8(0, entryOffset + 2); // color count
    dir.writeUInt8(0, entryOffset + 3); // reserved
    dir.writeUInt16LE(1, entryOffset + 4); // planes
    dir.writeUInt16LE(32, entryOffset + 6); // bit count
    dir.writeUInt32LE(img.png.length, entryOffset + 8); // bytes in resource
    dir.writeUInt32LE(offset, entryOffset + 12); // image offset

    chunks.push(img.png);
    offset += img.png.length;
  });

  return Buffer.concat(chunks);
}

async function main() {
  // Some environments (including parts of this repo tooling) set UV_THREADPOOL_SIZE
  // extremely high (e.g. 128), which can crash sharp/libvips on Windows.
  // Re-exec in a child process with a safe threadpool BEFORE loading sharp.
  const uv = Number(process.env.UV_THREADPOOL_SIZE || '');
  const shouldReexec = !process.env.FAVICONS_CHILD && Number.isFinite(uv) && uv > 16;
  if (shouldReexec) {
    const child = spawnSync(process.execPath, [__filename, ...process.argv.slice(2)], {
      stdio: 'inherit',
      env: {
        ...process.env,
        UV_THREADPOOL_SIZE: '8',
        SHARP_CONCURRENCY: process.env.SHARP_CONCURRENCY || '2',
        FAVICONS_CHILD: '1',
      },
    });
    process.exit(typeof child.status === 'number' ? child.status : 1);
  }

  if (process.env.FAVICONS_DEBUG === '1') {
    const env = process.env;
    const pick = k => (env[k] == null ? '' : String(env[k]));
    process.stdout.write(
      [
        `favicons debug: node=${process.version}`,
        `execPath=${process.execPath}`,
        `cwd=${process.cwd()}`,
        `npm_lifecycle_event=${pick('npm_lifecycle_event')}`,
        `npm_lifecycle_script=${pick('npm_lifecycle_script')}`,
        `NODE_OPTIONS=${pick('NODE_OPTIONS')}`,
        `UV_THREADPOOL_SIZE=${pick('UV_THREADPOOL_SIZE')}`,
        `SHARP_CONCURRENCY=${pick('SHARP_CONCURRENCY')}`,
        `SHARP_IGNORE_GLOBAL_LIBVIPS=${pick('SHARP_IGNORE_GLOBAL_LIBVIPS')}`,
      ].join(' | ') + '\n'
    );
  }

  // Load sharp only after the re-exec guard.
  // eslint-disable-next-line global-require
  const sharp = require('sharp');

  const { src } = parseArgs(process.argv.slice(2));
  if (!src) {
    process.stderr.write('Missing --src\n');
    process.exit(1);
  }

  const srcPath = path.resolve(process.cwd(), src);
  if (!fs.existsSync(srcPath)) {
    process.stderr.write(`Source not found: ${src}\n`);
    process.exit(1);
  }

  const pngSizes = [16, 32, 48, 96, 144, 192, 256, 384, 512];
  const icoSizes = [16, 32, 48, 64, 128, 256];
  const appleTouchSize = 180;
  const windowsTiles = {
    square70: { w: 70, h: 70, name: 'mstile-70x70.png' },
    square150: { w: 150, h: 150, name: 'mstile-150x150.png' },
    wide310x150: { w: 310, h: 150, name: 'mstile-310x150.png' },
    square310: { w: 310, h: 310, name: 'mstile-310x310.png' },
  };

  const srcBuffer = fs.readFileSync(srcPath);
  const makeSrc = () => sharp(srcBuffer).ensureAlpha();

  // Generate PNG favicons
  for (const size of pngSizes) {
    const out = path.join(process.cwd(), 'public', `favicon-${size}.png`);
    await writeImageFile({
      outPath: out,
      srcPath,
      pipeline: makeSrc()
        .resize(size, size, { fit: 'cover', position: 'centre' })
        .png({ compressionLevel: 9 }),
    });
  }

  // Standard filenames many tools expect
  {
    const out16 = path.join(process.cwd(), 'public', 'favicon-16x16.png');
    const out32 = path.join(process.cwd(), 'public', 'favicon-32x32.png');
    await writeImageFile({
      outPath: out16,
      srcPath,
      pipeline: makeSrc().resize(16, 16, { fit: 'cover', position: 'centre' }).png({
        compressionLevel: 9,
      }),
    });
    await writeImageFile({
      outPath: out32,
      srcPath,
      pipeline: makeSrc().resize(32, 32, { fit: 'cover', position: 'centre' }).png({
        compressionLevel: 9,
      }),
    });
  }

  // Apple touch icon
  {
    const out = path.join(process.cwd(), 'public', 'apple-touch-icon.png');
    await writeImageFile({
      outPath: out,
      srcPath,
      pipeline: makeSrc()
        .resize(appleTouchSize, appleTouchSize, { fit: 'cover', position: 'centre' })
        .png({ compressionLevel: 9 }),
    });
  }

  // Android Chrome icons (PWA default names)
  {
    const out192 = path.join(process.cwd(), 'public', 'android-chrome-192x192.png');
    const out512 = path.join(process.cwd(), 'public', 'android-chrome-512x512.png');
    await writeImageFile({
      outPath: out192,
      srcPath,
      pipeline: makeSrc().resize(192, 192, { fit: 'cover', position: 'centre' }).png({
        compressionLevel: 9,
      }),
    });
    await writeImageFile({
      outPath: out512,
      srcPath,
      pipeline: makeSrc().resize(512, 512, { fit: 'cover', position: 'centre' }).png({
        compressionLevel: 9,
      }),
    });
  }

  // Windows tiles for browserconfig.xml
  for (const tile of Object.values(windowsTiles)) {
    const out = path.join(process.cwd(), 'public', tile.name);
    await writeImageFile({
      outPath: out,
      srcPath,
      pipeline: makeSrc().resize(tile.w, tile.h, { fit: 'cover', position: 'centre' }).png({
        compressionLevel: 9,
      }),
    });
  }

  // Also generate public/favicon.png (commonly used in some places)
  {
    const out = path.join(process.cwd(), 'public', 'favicon.png');
    await writeImageFile({
      outPath: out,
      srcPath,
      pipeline: makeSrc().resize(512, 512, { fit: 'cover', position: 'centre' }).png({
        compressionLevel: 9,
      }),
    });
  }

  // Generate ICO (multi-size)
  const icoImages = [];
  for (const size of icoSizes) {
    const png = await makeSrc()
      .resize(size, size, { fit: 'cover', position: 'centre' })
      .png({ compressionLevel: 9 })
      .toBuffer();
    icoImages.push({ size, png });
  }

  const icoBuf = buildIco(icoImages);
  fs.writeFileSync(path.join(process.cwd(), 'public', 'favicon.ico'), icoBuf);
  // Keep this legacy/testing icon in sync too.
  fs.writeFileSync(path.join(process.cwd(), 'public', 'faviconkn.ico'), icoBuf);

  process.stdout.write(
    `Generated favicon PNG sizes: ${pngSizes.join(', ')}; standard icons (favicon-16x16.png, favicon-32x32.png, apple-touch-icon.png, android-chrome-192x192.png, android-chrome-512x512.png); Windows tiles; and favicon.ico sizes: ${icoSizes.join(', ')}\n`
  );
}

main().catch(err => {
  process.stderr.write(String(err && err.stack ? err.stack : err) + '\n');
  process.exit(1);
});
