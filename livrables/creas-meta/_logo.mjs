// Extrait le K du menu de kleakagency.fr en haute définition (rendu à x10).
import { chromium } from 'playwright';
const b = await chromium.launch({ channel: 'chromium' });
const p = await b.newPage({ viewport: { width: 1440, height: 300 }, deviceScaleFactor: 10 });
await p.goto('https://kleakagency.fr', { waitUntil: 'networkidle' });
await p.waitForTimeout(2000);
await p.screenshot({ path: '_captures/logo-zone.png', clip: { x: 360, y: 25, width: 45, height: 45 } });
await b.close();
