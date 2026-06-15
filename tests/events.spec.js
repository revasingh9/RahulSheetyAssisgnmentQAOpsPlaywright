const { test, expect } = require('@playwright/test');
const { login } = require('../LoginHelperFolder/login.helpers');
const { EventsPage } = require('../Pages/EventsPage');
 
test('Search reduces visible event count', async ({ page }) => {
  await login(page, 'your@email.com', 'yourpassword');
 
  const eventsPage = new EventsPage(page);
  await eventsPage.navigate();
 
  const totalBefore = await eventsPage.getCardCount();
  expect(totalBefore).toBeGreaterThan(0);
 
  await eventsPage.searchFor('Mumbai');     // There is no title such Mumbai, when we put Mumbai in the search textbox this is the title it shos Hollywood Monsoon Night — Los Angeles
 
  const totalAfter = await eventsPage.getCardCount();
  expect(totalAfter).toBeLessThan(totalBefore);
 
  const firstTitle = await eventsPage.getFirstCardTitle();
  expect(firstTitle.toLowerCase()).toContain('mumbai');
});