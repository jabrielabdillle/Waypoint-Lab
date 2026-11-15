import { test, expect } from '@playwright/test';

test('SQLite filters, pagination, details, escaping and export work', async ({ page }) => {
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('/');
  await expect(page.getByRole('heading',{name:'Robot training overview'})).toBeVisible();
  await expect(page.locator('.metrics strong').first()).toHaveText('18,000');
  await page.selectOption('#method','adaptive');
  await expect(page.locator('.metrics strong').first()).toHaveText('6,000');
  await page.getByRole('button',{name:'See all episodes'}).click();
  await page.getByLabel('Find an experiment run').fill('mock-adaptive-1');
  await expect(page.locator('.panel-heading p')).toContainText('1,200');
  await page.getByRole('button',{name:'Next page'}).click();
  await expect(page.locator('.pagination')).toContainText('Page 2');
  await page.getByRole('button',{name:/View episode/}).first().click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).not.toBeVisible();
  await page.getByLabel('Find an experiment run').fill("' OR 1=1 --");
  await expect(page.getByText('No matching episodes.',{exact:false})).toBeVisible();
  await page.getByLabel('Find an experiment run').fill('mock-adaptive-1');
  const download=page.waitForEvent('download');await page.getByRole('button',{name:'Export filtered CSV'}).click();
  expect((await download).suggestedFilename()).toBe('robotics-mock-episodes.csv');
  expect(errors).toEqual([]);
});

test('real-policy replay and scientific disclosure',async({page})=>{
  await page.goto('/');await page.getByRole('button',{name:'Watch robot replay'}).click();
  await expect(page.locator('#step')).toHaveText('Step 3 / 3');
  await page.getByRole('button',{name:'Reset replay'}).click();
  await expect(page.locator('#step')).toHaveText('Step 0 / 3');
  await page.getByRole('button',{name:'Research notes',exact:true}).click();
  await expect(page.getByRole('heading',{name:'A robot that learns to navigate'})).toBeVisible();
  await expect(page.getByText('not held-out generalization',{exact:false})).toBeVisible();
});

for(const width of [1440,1024,768,390,320]) test(`responsive layout ${width}`,async({page})=>{
  await page.setViewportSize({width,height:900});await page.goto('/');
  await expect(page.getByRole('heading',{name:'Robot training overview'})).toBeVisible();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  await page.screenshot({path:`../artifacts/screenshots/dashboard-${width}.png`,fullPage:true});
});
