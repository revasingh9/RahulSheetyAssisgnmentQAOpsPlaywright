const { test, expect } = require("@playwright/test");
const { openLoginPage } = require("../LoginHelperFolder/OpenLoginpage.helper");

test("Create a config-based smoke test", async ({ page }) => {
  await page.goto("/login");
    //Assert the page title matches /EventHub/i 
 await expect(page).toHaveTitle(/EventHub/i )
//  Assert the email field is visible
await expect(page.getByRole("textbox", { name: "Email" })).toBeVisible();
 //Assert the  Sign In button is visible
await expect(page.getByRole("button", { name: "Sign In" })).toBeVisible();
});



test("Test 2-Step 1 — Use the built-in page fixture", async ({ page,browser }) => {

   await openLoginPage(page);

   const emailField = await page.getByRole("textbox", { name: "Email" });
   await emailField.fill("beginner@sample.com");

   await expect(emailField).toHaveValue("beginner@sample.com");
 

  
});
  // This test creates a new browser context manually
test("Test 2-Step 2 — Create a fresh browser context manually", async ({ browser }) => {
   const isolatedContext = await browser.newContext();
   const isolatedPage = await isolatedContext.newPage();
   await isolatedPage.goto("https://eventhub.rahulshettyacademy.com/login");
   await isolatedPage.waitForTimeout(5000);
   await expect( isolatedPage.getByRole('heading',{name:'Sign in to EventHub'})).toBeVisible();
   await expect( isolatedPage.getByRole('textbox',{name:'Email'})).toBeEmpty();
   await isolatedPage.close();
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

//A fresh context always starts with a completely isolated, pristine state.
// This guarantees that cookies, local storage, cache, and session data from one test never leak into another test, ensuring your tests are independent and parallelizable.