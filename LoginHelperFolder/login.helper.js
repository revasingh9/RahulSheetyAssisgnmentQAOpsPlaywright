const { expect } = require('@playwright/test');

async function login(page, email, password) {
  await page.goto('https://eventhub.rahulshettyacademy.com/login');
  expect(page.getByPlaceholder('you@email.com')).toBeVisible()
  await page.getByPlaceholder('you@email.com').fill(email);
  await page.getByLabel('Password').fill(password);
  expect(page.getByRole('button', { name: 'Sign In' })).toBeVisible()
  await page.getByRole('button', { name: 'Sign In' }).click();
  await page.waitForTimeout(3000);
  
  await expect(page.getByRole('link', { name: 'Browse Events →' })).toBeVisible();
  
}

async function getEventTitles(page) {
  const cards = page.locator('[data-testid="event-card"]');
  const count = await cards.count();
  const titles = [];
  for (let i = 0; i < count; i++) {
    //console.log(await cards.nth(i).innerHTML());
     const title = await cards.nth(i).getByRole('link').first().innerText();
   
    titles.push(title);
  }
  return titles;
}

module.exports = { login, getEventTitles };