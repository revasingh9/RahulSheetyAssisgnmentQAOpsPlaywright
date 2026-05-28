const { expect } = require('@playwright/test');


async function login(page) {
// const email = process.env.LOGIN_EMAIL;
// const password = process.env.LOGIN_PASSWORD;
  await page.goto('/login');
  expect(page.getByPlaceholder('you@email.com')).toBeVisible()
  await page.getByPlaceholder('you@email.com').fill(process.env.LOGIN_EMAIL);
  await page.getByLabel('Password').fill(process.env.LOGIN_PASSWORD);
  expect(page.getByRole('button', { name: 'Sign In' })).toBeVisible()
  await page.getByRole('button', { name: 'Sign In' }).click();
  await expect(page.getByRole('link', { name: 'Browse Events →' })).toBeVisible();
  
}
module.exports = { login };