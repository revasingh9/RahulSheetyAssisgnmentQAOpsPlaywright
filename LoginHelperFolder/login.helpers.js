const { expect } = require('@playwright/test');
 
async function login(page, email, password) {
  await page.goto('https://eventhub.rahulshettyacademy.com/login');
  await page.getByPlaceholder('you@email.com').fill(email);
  await page.getByLabel('Password').fill(password);
  await page.locator('#login-btn').click();
  await expect(page.getByRole('link', { name: 'Browse Events' })).toBeVisible();
}
 
async function getEventTitles(page) {
  const cards = page.locator('[data-testid="event-card"]');
  const count = await cards.count();
  const titles = [];
  for (let i = 0; i < count; i++) {
    const title = await cards.nth(i).locator('[data-testid="event-title"]').innerText();
    titles.push(title);
  }
  return titles;
}
 
module.exports = { login, getEventTitles };