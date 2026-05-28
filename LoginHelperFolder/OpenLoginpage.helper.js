const { expect } = require('@playwright/test');

async function openLoginPage(page) {
  await page.goto('/login');
 await expect(page.getByRole('heading',{name:'Sign in to EventHub'})).toBeVisible()
}

module.exports = { openLoginPage };