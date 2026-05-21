const { test, expect } = require("@playwright/test");
const { login, getEventTitles,parseSeatCount } = require("../LoginHelperFolder/login.helper");
//const { setDefaultAutoSelectFamilyAttemptTimeout } = require("net");

test("Login and open the Events page", async ({ page }) => {
  await page.goto("/login");
  await login(page, "revasingh9@yahoo.in", "Mall##ika30");
  await page.viewportSize({ width: 1920, height: 1080 });
  await page
    .getByRole("link", { name: /browse events/i })
    .first()
    .click();
  expect(page.locator("text=Upcoming Events")).toBeVisible();
  const cards = page.locator("#event-card");
  await page.waitForTimeout(5000);
  const count = await cards.count();
  console.log("No Of Card Count:", count);
  for (let i = 0; i < count; i++) {
    const text = await cards.nth(i).textContent();
    console.log(text);
  }
  await expect(count).toBeGreaterThan(0);
  await page.getByPlaceholder("Search events, venues…").fill("World");
  const categoryDropDownOptionMenu = page.getByRole("combobox").first();
  await page.waitForTimeout(5000);
  const valueOfCategoryDropDownOption =
    await categoryDropDownOptionMenu.allInnerTexts();
  console.log(valueOfCategoryDropDownOption);
  await categoryDropDownOptionMenu.selectOption("Conference");
  const categoryDropDownOptionMenu1 = page.getByRole("combobox").nth(1);
  const valueOfCategoryDropDownOption1 =
    await categoryDropDownOptionMenu1.allInnerTexts();
  console.log(valueOfCategoryDropDownOption1);
  await categoryDropDownOptionMenu1.selectOption("Hyderabad");
  expect(
    page.getByRole("heading", { name: "World Tech Summit" }),
  ).toBeVisible();
  const cards1 = page.locator("#event-card");
  await expect(cards1).toHaveCount(1);
});

test("Work with multiple matching event cards", async ({page}) => {
  await page.goto("/login");
  await login(page, "revasingh9@yahoo.in", "Mall##ika30");
  const titles = await getEventTitles(page);
  console.log("Titles:", titles);
  
    // UI locator for assertions
 const cards = page.locator('[data-testid="event-card"]')
 // 1. first card visible
   await expect(cards.first()).toBeVisible()
    // 2. at least 1 card exists
 const count =await cards.count()
  await expect(count).toBeGreaterThan(0)
  // 3. filtered locator
  const summitCard = cards.filter({hasText:"World Tech Summit"})

   await expect(summitCard).toHaveCount(1);
  const firstCard = cards.first()
  const eventTitle = await firstCard.locator('h3').innerText()
  console.log('Event Title:',eventTitle)
     const eventSeatsText = await firstCard.locator(('//span[@class="text-xs font-semibold text-emerald-600"]'))
    const seatCountwithoutText = (await eventSeatsText.innerText()).slice(0, 2)
    console.log(`No Of Seats: ${seatCountwithoutText}`)
  const eventPriceText = await firstCard.getByText(/(\$|USD\s?)\s?\d+(\.\d{1,2})?/).innerText();
  console.log(eventPriceText)
  const worldTechSummit= await summitCard.locator('h3').innerText()
  console.log(worldTechSummit)
  expect(worldTechSummit).toEqual('World Tech Summit')
  const textContainingDollar = await summitCard.getByText(/(\$|USD\s?)\s?\d+(\.\d{1,2})?/).innerText()
  expect(textContainingDollar).toContain('$')
 const parseSeat = await parseSeatCount(page,summitCard)
expect(parseInt(parseSeat)).toBeGreaterThan(0)

const worldtechsummitBookNowButton =  summitCard.getByRole('link',{name:'Book Now'})
await worldtechsummitBookNowButton.click()
await page.waitForLoadState("networkidle")
console.log(page.url())
expect(page.url()).toContain('/events/')
const h1Text = await page.locator('h1',{hasText:"World Tech Summit"}).innerText()
console.log(h1Text)
expect(h1Text).toEqual(worldTechSummit)
const pricePerTicket = await page.getByRole('paragraph').filter({ hasText: '$' }).innerText()
console.log(pricePerTicket)
expect(pricePerTicket).toEqual(textContainingDollar)
await page.getByRole('link',{name:'Events'}).nth(2).click()
const searchTextBox = await page.getByPlaceholder("Search events, venues…")
await expect(searchTextBox).toHaveValue('')
const categoryDropDownOptionMenu = await page.getByRole("combobox").first()
await expect(categoryDropDownOptionMenu).toHaveValue('')
const allCitiesDownOptionMenu1 =await page.getByRole("combobox").nth(1)
await expect(allCitiesDownOptionMenu1).toHaveValue('')
await expect(count).toBeGreaterThanOrEqual(3)
const headingText = cards.first()
  const eventTitle1 = await headingText.locator('h3').innerText()
  console.log('Event Title:',eventTitle1)
  const lastCard = cards.last()
   const eventTitle2 = await lastCard.locator('h3').innerText()
  console.log('Event Title:',eventTitle2)
  const nthCard = cards.nth(1)
  const eventTitle3 = await nthCard.locator('h3').innerText()
  console.log('Event Title:',eventTitle3)

  
});
