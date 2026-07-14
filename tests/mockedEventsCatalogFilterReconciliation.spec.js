const { test, expect } = require("@playwright/test");
const { login } = require("../LoginHelperFolder/login.helper");
const { installMockEventRoutes, buildMockEvents, findEventCardByTitle,} = require("../LoginHelperFolder/buildMockEvents.helper");
const {  createBookingFromFilters} = require("../LoginHelperFolder/createBookingFromFilters.helper");
const { parseCurrency } = require("../LoginHelperFolder/parseCurrency.helper");
const { parseSeatCount } = require("../LoginHelperFolder/parseSeatCount.helper");
//Test 1 — Mocked events catalog displays controlled data
//Step 1 — Sign in and open Events with mock data active
test("mock events page", async ({ page }) => {
  await installMockEventRoutes(page, buildMockEvents);
  console.log("Mock routes installed");
  await page.goto("/login");
  await login(page, process.env.LOGIN_EMAIL,process.env.LOGIN_PASSWORD);
  await page.getByRole("link", { name: "Browse Events →" }).click();
  //Assert heading visible
  await expect(
    page.getByRole("heading", { name: "Upcoming Events" }),
  ).toBeVisible();
  for (const event of buildMockEvents) {
    const eventCard = page
      .locator('[data-testid="event-card"]')
      .filter({ hasText: event.title });
      //Assert title visible
    await expect(
      eventCard.getByRole("heading", { name: event.title }),
    ).toBeVisible();
    console.log(` Found event: ${event.title}`);
    //Assert exactly 4 visible event cards are rendered
    const countCard = await page.locator('[data-testid="event-card"]').count();
    await expect(countCard).toBe(4);
    //Assert all 4 mocked event titles are visible by text or heading locators
       await expect(
      eventCard.getByRole("heading", { name: event.title }),
    ).toBeVisible();
    ////Call your findEventCardByTitle(page, targetTitle) helper on the remaining card and store the matched mocked event object in test scope
    const targetTitle = await eventCard.getByRole("heading").innerText();
    const { card, mockEvent } = await findEventCardByTitle( page,targetTitle,buildMockEvents,    );
    await expect(
      card.getByRole("heading", { name: mockEvent.title }),
    ).toHaveText(targetTitle);
    //Assert the live title World Tech Summit is not visible anymore
    await expect(
      page.getByRole("heading", { name: "World Tech Summit" }),
    ).not.toBeVisible();
    //Assert each mocked card shows the expected price text and seat availability text from your mock dataset
    const mockedcardPriceText = await eventCard
      .locator(".text-lg.font-bold.text-indigo-700")
      .innerText();
    const numericPrice = parseInt(
      mockedcardPriceText.replace("$", "").replace(",", "").trim(),
    );
    console.log(`Price: ${numericPrice}`);
    await expect(numericPrice).toBe(event.price);
    const mockedCardSeatAvailability = await eventCard
      .locator('//span[@class="text-xs font-semibold text-emerald-600"]')
      .innerText();
    const seatCount = parseInt(mockedCardSeatAvailability.split(" ")[0]);
    console.log(`No Of Seats: ${seatCount}`);
    await expect(seatCount).toBe(event.totalSeats);
    //Assert the title link and Book Now link inside each card point to /events/{mockedId} for that same mocked record

    await expect(
      eventCard.getByRole("link", { name: event.title }),
    ).toHaveAttribute("href", `/events/${event.id}`);
    await expect(
      eventCard.getByRole("link", { name: "Book Now" }),
    ).toHaveAttribute("href", `/events/${String(event.id)}`);
  }
  //Fill the Search events, venues... textbox with the keyword for your Hyderabad conference event
  //Select Conference from the category combobox
  //Select Hyderabad from the city combobox
  const livefiltersagainstthemockeddataset = await createBookingFromFilters(
    page,
    { searchText: "world", category: "Conference", city: "Hyderabad" },
  );
  const assertCountToOne = await livefiltersagainstthemockeddataset.count();
  console.log(assertCountToOne);
  //Assert exactly one visible event card remains after filtering
  expect(assertCountToOne).toBe(1);
  //Assert the remaining card still shows the matched price and seats taken from that stored object- I don't understand this question
});

test("Reconcile the filtered card on the mocked detail page", async ({ page }) => {
  await installMockEventRoutes(page, buildMockEvents);
  console.log("Mock routes installed for detail page test", buildMockEvents[0].id);
  await page.goto("/login");
  await login(page, process.env.LOGIN_EMAIL,process.env.LOGIN_PASSWORD);
  await page.getByRole("link", { name: "Browse Events →" }).click();
   await expect(
    page.getByRole("heading", { name: "Upcoming Events" }),
  ).toBeVisible();
  const {card, mockEvent} = await findEventCardByTitle(page,"Tech Conference 2026", buildMockEvents);
  //card.getByRole('link', { name: buildMockEvents[0].title }).click()

  // await card.getByRole('link', { name: buildMockEvents[0].title }).click();
  const detailPageTitle = await card.getByRole("heading").innerText();
  await expect(detailPageTitle).toBe(buildMockEvents[0].title);
  //Expected: Price per ticket matches the stored mock price
  const detailPagePriceText = await card.locator(".text-lg.font-bold.text-indigo-700").innerText();
  const parsedPrice = await parseCurrency(detailPagePriceText);
  
  console.log(`Detail Page Price: ${detailPagePriceText}`);
  await expect(parsedPrice).toBe(buildMockEvents[0].price);
  //Expected: Venue and City match the stored mock values
;
  const detailPageCity = await card.locator(".line-clamp-1").nth(1).innerText();
 
  await expect(detailPageCity).toContain(buildMockEvents[0].city);
  //Expected: Available seats match the stored mock seat count
  const detailPageSeats = await page.locator(".text-xs.font-semibold.text-emerald-600").nth(0).innerText();
    console.log(`Detail Page Seats: ${detailPageSeats}`);
    const parsedSeatCount = await parseSeatCount(detailPageSeats);
  await expect(parsedSeatCount).toBe(buildMockEvents[0].totalSeats);
  //Expected: Ticket quantity starts at 1
  // const ticketQuantityValue = await page.locator('input[type="number"]').inputValue();
  // const numericTicketQuantity = parseInt(ticketQuantityValue);
  // console.log(`Ticket Quantity: ${numericTicketQuantity}`);
  // await expect(numericTicketQuantity).toBe(1);
  // //Expected: Total amount equals the mock ticket price for quantity 1 (use parseCurrency on the displayed total)
  // const detailPageTotalText = await page.locator(".text-2xl.font-bold.text-indigo-700").innerText();
  // const numericTotal = parseInt(detailPageTotalText.replace("$", "").replace(",", "").trim());
  // console.log(`Detail Page Total: ${numericTotal}`);
  // await expect(numericTotal).toBe(mockEvent.price);
  // //Increase ticket quantity to 2 using the + control
  // await page.locator('button[aria-label="Increase quantity"]').click();
  // //Expected: Quantity displays 2
  // const updatedTicketQuantityValue = await page.locator('input[type="number"]').inputValue();
  // const updatedNumericTicketQuantity = parseInt(updatedTicketQuantityValue);
  // console.log(`Updated Ticket Quantity: ${updatedNumericTicketQuantity}`);
  // await expect(updatedNumericTicketQuantity).toBe(2);
  // //Expected: Total amount updates to 2x the mock ticket price
  // const updatedTotalText = await page.locator(".text-2xl.font-bold.text-indigo-700").innerText();
  // const updatedNumericTotal = parseInt(updatedTotalText.replace("$", "").replace(",", "").trim());
  // console.log(`Updated Detail Page Total: ${updatedNumericTotal}`);
  // await expect(updatedNumericTotal).toBe(mockEvent.price * 2);
  //From the remaining card in Test 1, click Book Now
   await card.getByTestId('book-now-btn').click()
 //Expected: Browser navigates to /events/{matchedMockId}
  await expect(page).toHaveURL(`/events/${buildMockEvents[0].id}`)

});
