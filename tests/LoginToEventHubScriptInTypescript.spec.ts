import { test, expect } from '@playwright/test';
import { login, getEventTitles } from '../LoginHelperFolder/Login.Helper.ts';

test('Verify Events', async ({ page }) => {

await login(page,"revasingh9@yahoo.in","Mall##ika30");
const titles = await getEventTitles(page);
console.log(titles);
expect(titles.length).toBeGreaterThan(0);


})