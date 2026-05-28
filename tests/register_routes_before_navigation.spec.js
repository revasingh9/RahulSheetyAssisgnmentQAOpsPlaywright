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

test("mock events page", async ({ page }) => {
  await installMockEventRoutes(page, mockEvents);
  await page.goto("/login");
  await login(page, process.env.LOGIN_EMAIL,process.env.LOGIN_PASSWORD);
  await page.getByRole("link", { name: "Browse Events →" }).click();
  await expect(
    page.getByRole("heading", { name: "Upcoming Events" }),
  ).toBeVisible();
  for (const event of mockEvents) {
    await expect(
      page.getByRole("heading", { name: event.title }),
    ).toBeVisible();
    console.log(` Found event: ${event.title}`);
    //Assert exactly 4 visible event cards are rendered
    const countCard = await page.locator('[data-testid="event-card"]').count();
    await expect(countCard).toBe(4);
    //Assert all 4 mocked event titles are visible by text or heading locators
    const eventCard = page
      .locator('[data-testid="event-card"]')
      .filter({ hasText: event.title });
    await expect(
      eventCard.getByRole("heading", { name: event.title }),
    ).toBeVisible();
    ////Call your findEventCardByTitle(page, targetTitle) helper on the remaining card and store the matched mocked event object in test scope
    const targetTitle = await eventCard.getByRole("heading").innerText();
    const { card, mockEvent } = await findEventCardByTitle(
      page,
      targetTitle,
      mockEvents,
    );
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
  await installMockEventRoutes(page, mockEvents);
  await page.goto("/login");
  await login(page, process.env.LOGIN_EMAIL,process.env.LOGIN_PASSWORD);
  await page.getByRole("link", { name: "Browse Events →" }).click();
   await expect(
    page.getByRole("heading", { name: "Upcoming Events" }),
  ).toBeVisible();
  const {card, mockEvent} = await findEventCardByTitle(page,"Tech Conference 2026", mockEvents);
 await card.getByTestId('book-now-btn').click()
  
     
 
});
