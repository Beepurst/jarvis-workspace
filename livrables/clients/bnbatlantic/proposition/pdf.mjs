// Rend proposition.html en PDF A4 (playwright de livrables/creas-meta).
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
const ICI = dirname(fileURLToPath(import.meta.url));
const { chromium } = createRequire(join(ICI, '../../../creas-meta/package.json'))('playwright');
const b = await chromium.launch({ channel: 'chromium' });
const p = await b.newPage();
await p.goto('file://' + join(ICI, 'proposition.html'), { waitUntil: 'networkidle' });
await p.pdf({ path: join(ICI, 'proposition-bnbatlantic.pdf'), format: 'A4', printBackground: true, preferCSSPageSize: true });
for (const [i, n] of [[0, 1], [1, 2], [2, 3]]) {
  await p.setViewportSize({ width: 794, height: 1123 });
  await p.evaluate((i) => document.querySelectorAll('.page')[i].scrollIntoView(), i);
  await p.waitForTimeout(1200);
  await p.screenshot({ path: join(ICI, `_apercu-${n}.png`) });
}
await b.close();
