const { test, expect, browser } = require("@playwright/test");
const { login } = require("../LoginHelperFolder/OpenLoginpage.helper");

test("Create a config-based smoke test", async ({ page }) => {
  await page.goto("/login");
    //Assert the page title matches /EventHub/i 
 await expect(page).toHaveTitle(/EventHub/i )
//  Assert the email field is visible
await expect(page.getByRole("textbox", { name: "Email" })).toBeVisible();
 //Assert the  Sign In button is visible
await expect(page.getByRole("button", { name: "Sign In" })).toBeVisible();
});





 
test('Run in Multiple Browsers',async ({ page, browserName }) => {

   console.log(browserName);

   await expect(['chromium','firefox']).toContain(browserName);
})

// Explain the difference between page fixture and browser context

//Page Fixture : A single tab within that incognito window.
// It is used in test for direct interactions of web elements like page.goto() or page.click(), but it shares the session of its parent context.Every page belongs to exactly one context.


//Browser Context :-A fresh "Incognito" window or user profile.Provides a clean slate with its own cookies, local storage, and cache.
//One context can contain multiple pages (tabs).Ideal for multi-user scenarios (e.g., chat apps) or global settings like geolocation and permissions.