const { chromium, devices } = require('playwright');
(async () => {
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext(devices['iPhone 12']);
    const page = await context.newPage();
    console.log('Navigating...');
    await page.goto('https://www.chiangmaiusedcar.com', { waitUntil: 'networkidle' });
    await page.waitForTimeout(3000);
    const bounds = await page.evaluate(() => {
        const el = document.querySelector('.overflow-x-auto');
        if (!el) return null;
        const rect = el.getBoundingClientRect();
        return { x: rect.x, y: rect.y, width: rect.width, height: rect.height };
    });
    if (bounds) {
        await page.screenshot({ path: 'dev-tools/pills.png', clip: bounds });
    } else {
        await page.screenshot({ path: 'dev-tools/pills.png' });
    }
    await browser.close();
    console.log('Done');
})();
