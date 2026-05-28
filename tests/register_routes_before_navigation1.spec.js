const { test, expect } = require("@playwright/test");
const { login } = require("../LoginHelperFolder/login.helper");
const {
  installMockEventRoutes,
  mockEvents,
  findEventCardByTitle,
} = require("../LoginHelperFolder/MockEventRoutes.helper");
const {
  createBookingFromFilters,
} = require("../LoginHelperFolder/createBookingFromFilters.helper");


test("Reconcile the filtered card on the mocked detail page", async ({ page }) => {
  await installMockEventRoutes(page, mockEvents);
  await page.goto("/login");
  await login(page, process.env.LOGIN_EMAIL,process.env.LOGIN_PASSWORD);
  await page.getByRole("link", { name: "Browse Events →" }).click();
   await expect(
    page.getByRole("heading", { name: "Upcoming Events" }),
  ).toBeVisible();
 
});
