const { test, expect } = require("@playwright/test");
const { login } = require("../LoginHelperFolder/login.helper");
const {getEventCards} = require('../LoginHelperFolder/getEventCards.helper');
const { parseSeatCount } = require("../LoginHelperFolder/parseSeatCount.helper");

//const { setDefaultAutoSelectFamilyAttemptTimeout } = require("net");

test("Login and open the Events page", async ({ page }) => {
  await login(page);
  await page.viewportSize({ width: 1920, height: 1080 });
  await page
    .getByRole("link", { name: /browse events/i })
    .first()
    .click();
  await expect(page.locator("text=Upcoming Events")).toBeVisible();
  // const cards = page.locator("#event-card");
  // await page.waitForTimeout(5000);
  // const count = await cards.count();
  // console.log("No Of Card Count:", count);
  // for (let i = 0; i < count; i++) {
  //   const text = await cards.nth(i).textContent();
  //   console.log(text);
  // }
  // await expect(count).toBeGreaterThan(0);
  await page.getByPlaceholder("Search events, venues…").fill("World");
  const categoryDropDownOptionMenu = page.getByRole("combobox").first();
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
   await login(page);
  const cards = await getEventCards(page);
 //Assert the total matched cards count is at least 1
   await expect(cards.first()).toBeVisible()
        // Use your getEventCards(page) helper to capture all visible event cards
 const count =await cards.count()
  console.log("Cards Count:", count);
  await expect(count).toBeGreaterThan(0)
  // 3. filtered locator
  const summitCard = await cards.filter({hasText:"World Tech Summit"})
//Assert the filtered locator count is exactly 1
   await expect(summitCard).toHaveCount(1);
   //Assert the matching card is visible
   await expect(summitCard).toBeVisible()
  const worldTechSummit= await summitCard.locator('h3').innerText()
  console.log(worldTechSummit)
  await expect(worldTechSummit).toEqual('World Tech Summit')
  const textContainingDollar = await summitCard.getByText(/(\$|USD\s?)\s?\d+(\.\d{1,2})?/).innerText()
  console.log('Ticket Price:',textContainingDollar)
  await expect(textContainingDollar).toContain('$')

  const seatText = await summitCard.getByText(/\d+\s+seats available/i).innerText()
  console.log('Seat Count with text:', seatText)
 const seatCount = await parseSeatCount(seatText)
await expect(seatCount).toBeGreaterThan(0)
await expect(typeof seatCount).toBe('number')
const worldtechsummitBookNowButton =  summitCard.getByRole('link',{name:'Book Now'})
await worldtechsummitBookNowButton.click()
await page.waitForLoadState("networkidle")
console.log(page.url())
await expect(page.url()).toContain('/events/')
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
  console.log('Event Title1:',eventTitle1)
  await expect(eventTitle1).toContain('Dilli Diwali Mela')
  const lastCard = cards.last()
   const eventTitle2 = await lastCard.locator('h3').innerText()
  console.log('Event Title2:',eventTitle2)
  const nthCard = cards.nth(1)
  const eventTitle3 = await nthCard.locator('h3').innerText()
  console.log('Event Title3:',eventTitle3)
  await expect(eventTitle3).toContain('Hollywood Monsoon Night — Los Angeles')
  const allExtractedTitle = await cards.locator('h3').allInnerTexts()
  const allNonEmptyStrings = allExtractedTitle.every(title => title.trim() !== '');
 await expect(allNonEmptyStrings).toBe(true);
  console.log('All titles:', allExtractedTitle)
  await expect(allExtractedTitle.at(0)).not.toBe(allExtractedTitle.at(-1))

  
});
