import { writeFile } from 'node:fs/promises';
import puppeteer from 'puppeteer';
import database from '../database.json';
import products from './products.json';
import selectors from './selectors.json';
import type { Selector } from './types.js';

const browser = await puppeteer.launch({ headless: 'new' });
const page = await browser.newPage();
await page.setViewport({ width: 1280, height: 720 });

for await (const productUrl of products) {
  const selectorIndex = Object.keys(selectors).find((key) => new RegExp(key).test(productUrl)) ?? '';
  const selector = (selectors as Record<string, Selector>)[selectorIndex];
  if (!selector) continue;

  console.log('checking', productUrl, selector.name);

  await page.goto(productUrl);
  const content = await page.waitForSelector(selector.selector);
  if (!content) continue;

  const textContent = (await (await content.getProperty('textContent')).jsonValue()) as string | null;
  if (!textContent) continue;

  let price: number;

  if (selector.type === 'json') {
    const jsonData = JSON.parse(textContent) as Record<string, unknown>;
    // eslint-disable-next-line @typescript-eslint/no-implied-eval, no-new-func -- Needed to access nested properties
    price = new Function('data', `return data.${selector.path}`)(jsonData) as number;
  } else {
    price = Number(textContent);
  }

  const previousPrice = (database as unknown as Record<string, string>)[productUrl];
  if (previousPrice && Number(price) < Number(previousPrice)) {
    console.info(`price decreased from ${previousPrice} to ${price}`);
  }
  (database as unknown as Record<string, number>)[productUrl] = price;

  console.log('found price for', productUrl, price);
  await writeFile('./database.json', JSON.stringify(database, null, 2));
}
