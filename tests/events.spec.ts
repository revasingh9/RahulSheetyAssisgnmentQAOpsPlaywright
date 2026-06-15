import { test, expect } from '@playwright/test';
import { login } from '../LoginHelperFolder/Login.Helper';
import { EventsPage } from '../Pages/EventsPage.ts';

test('Search reduces visible event count', async ({ page }) => {
  await login(page, 'your@email.com', 'yourpassword');
 
  const eventsPage = new EventsPage(page);
  await eventsPage.navigate();
  await page.waitForTimeout(3000)
 
  const totalBefore = await eventsPage.getCardCount();
  
  await expect(totalBefore).toBeGreaterThan(0);
 
  await eventsPage.searchFor('Hollywood');
    await page.waitForTimeout(3000)
 
  const totalAfter = await eventsPage.getCardCount();
  await expect(totalAfter).toBeLessThan(totalBefore);
 
  const firstTitle = await eventsPage.getFirstCardTitle();
  await expect(firstTitle.toLowerCase()).toContain('hollywood monsoon night — los angeles');
});