import { Page,expect } from '@playwright/test';

export async function login(
    page : Page, 
    email: string,
    password: string)
     {
  await page.goto('https://eventhub.rahulshettyacademy.com/login');
  //await expect(page.getByRole('heading', { name: 'Sign in to EventHub'})).toBeVisible()
  await page.getByPlaceholder('you@email.com').fill(email);
  await page.getByLabel('Password').fill(password);
  await page.getByRole('button', { name: 'Sign In' }).click();

  
  await expect(page.getByRole('link', { name: 'Browse Events →' })).toBeVisible();
  
}

export async function getEventTitles(page:Page): Promise<string[]> {
  const cards = page.locator('[data-testid="event-card"]');
  const count = await cards.count();
  const titles = [];
  for (let i = 0; i < count; i++) {
        const title = await cards.nth(i).getByRole('link').first().innerText();
    titles.push(title);
  }
  return titles;
}
