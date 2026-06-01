const { expect } = require("@playwright/test");

async function loginUserNamePassword(page, email, password) {
  await page.goto("/login");
  await page.getByPlaceholder("you@email.com").fill(email);
  await page.getByLabel("Password").fill(password);
  await page.getByRole("button", { name: "Sign In" }).click();
  await expect(page.getByRole('link',{name:'My Bookings'}).first()).toBeVisible()
}
module.exports = { loginUserNamePassword };