const fs = require('fs');
const path = require('path');

function getDirSize(dirPath) {
    let size = 0;
    try {
        const files = fs.readdirSync(dirPath);
        for (const file of files) {
            const filePath = path.join(dirPath, file);
            try {
                const stats = fs.statSync(filePath);
                if (stats.isDirectory()) {
                    // Skip likely symlinks/junctions to avoid loops
                    size += getDirSize(filePath);
                } else {
                    size += stats.size;
                }
            } catch (e) { continue; }
        }
    } catch (e) {}
    return size;
}

const checkPaths = [
    'C:/Users/Admin/AppData/Local',
    'C:/Users/Admin/AppData/Roaming',
    'C:/Users/Admin/Downloads',
    'C:/Users/Admin/Documents',
    'C:/Windows/Temp',
    'C:/ProgramData'
];

console.log('Scanning large directories...');
for (const p of checkPaths) {
    if (fs.existsSync(p)) {
        const sizeGB = getDirSize(p) / (1024 * 1024 * 1024);
        console.log(`${p}: ${sizeGB.toFixed(2)} GB`);
    } else {
        console.log(`${p}: Not found or access denied`);
    }
}
// check direct appdata subfolders if local is huge
const localPath = 'C:/Users/Admin/AppData/Local';
if (fs.existsSync(localPath)) {
    const subdirs = fs.readdirSync(localPath);
    let subs = [];
    for (const d of subdirs) {
        const p = path.join(localPath, d);
        try {
            if (fs.statSync(p).isDirectory()) {
                 const s = getDirSize(p) / (1024*1024*1024);
                 if (s > 0.5) subs.push({n: d, s});
            }
        } catch(e){}
    }
    subs.sort((a,b) => b.s - a.s).slice(0, 5).forEach(x => {
        console.log(`  -> Local/${x.n}: ${x.s.toFixed(2)} GB`);
    });
}
