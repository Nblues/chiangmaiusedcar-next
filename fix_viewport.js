const fs = require('fs');
let content = fs.readFileSync('app/layout.tsx', 'utf8');

if (!content.includes('export const viewport')) {
    const importViewport = "import type { Metadata, Viewport } from 'next'\n";
    content = content.replace("import type { Metadata } from 'next'\n", importViewport);
    
    const viewportBlock = "export const viewport: Viewport = {\n  width: 'device-width',\n  initialScale: 1,\n  maximumScale: 1,\n  userScalable: false,\n}\n\nexport const metadata: Metadata = {";
    
    content = content.replace("export const metadata: Metadata = {", viewportBlock);
    
    fs.writeFileSync('app/layout.tsx', content, 'utf8');
    console.log('Fixed viewport');
} else {
    console.log('Viewport already fixed');
}
