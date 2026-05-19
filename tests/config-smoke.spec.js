const { test, expect, browser } = require("@playwright/test");
const { login } = require("../LoginHelperFolder/OpenLoginpage.helper");

test("Create a config-based smoke test", async ({ page }) => {
  await page.goto("/");
  //expect(pageage.getByRole("heading", { name: "Sign in to EventHub" })).toBeVisible();
  //Assert the page title matches /EventHub/i - I am not seeing the such page title
  await page.waitForTimeout(5000);
  expect(page.getByRole("textbox", { name: "Email" })).toBeVisible();

  expect(page.getByRole("button", { name: "Sign In" })).toBeVisible();
});

test("Use the built-in page fixture", async ({ page }) => {
  await login(page);
  const emailTextbox = page.getByRole("textbox", { name: "Email" });
  const enteredUsername = await emailTextbox.fill("beginner@sample.com");
  expect(emailTextbox).toHaveValue("beginner@sample.com");
});



test('Create a fresh browser context manually', async({browser}) => {

    const isolatedContext = await browser.newContext()
    const isolatedPage = await isolatedContext.newPage()
    await isolatedPage.goto('https://eventhub.rahulshettyacademy.com/login')
    
    expect(isolatedPage.getByRole('heading',{name:'Sign in to EventHub'})).toBeVisible();

    expect(isolatedPage.getByRole('textbox',{name:"Email"})).toHaveValue("")
    await isolatedPage.waitForTimeout(5000)
    await isolatedContext.close()

})
test('Run in Multiple Browsers',async ({ page, browserName }) => {

   console.log(browserName);

   expect(['chromium','firefox']).toContain(browserName);
})

// Explain the difference between page fixture and browser context

//Page Fixture : A single tab within that incognito window.
// It is used in test for direct interactions of web elements like page.goto() or page.click(), but it shares the session of its parent context.Every page belongs to exactly one context.


//Browser Context :-A fresh "Incognito" window or user profile.Provides a clean slate with its own cookies, local storage, and cache.
//One context can contain multiple pages (tabs).Ideal for multi-user scenarios (e.g., chat apps) or global settings like geolocation and permissions.