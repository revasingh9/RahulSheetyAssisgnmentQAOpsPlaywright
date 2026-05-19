const { expect } = require('@playwright/test');

async function login(page) {
  await page.goto('/login');

 
  
}

module.exports = { login };