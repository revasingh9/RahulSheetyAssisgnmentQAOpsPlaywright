const { test, expect } = require("@playwright/test");
const { login } = require("../LoginHelperFolder/login.helper");
const {
  createBookingFromFilters,
  bookingAssertion,
  bookNow,
  locateEventBookingCard,
  extractBookingCardDetails,
  writeBookingDataToFile,
  viewCardDetail,
} = require("../LoginHelperFolder/createBookingFromFilters.helper")
const { faker } = require("@faker-js/faker");
const fs = require("fs");
const path = require("path");
const Booking_Refs_File = path.resolve(
  process.cwd(),
  "Data",
  "bookingRefs.json",
);
const Booking_Refs_InputFile_Data = path.resolve(
  process.cwd(),
  "Data",
  "bookingRefsData.json",
);
test.describe.configure({ mode: "serial" });

test("Create Booking From Filters", async ({ page }) => {

  await login(page);
  await page.getByRole("link", { name: "Browse Events →" }).click();
  

  const cards = await createBookingFromFilters(page, {
    searchText: "World",
    category: "Conference",
    city: "Hyderabad",
  });
  await expect(
    cards.getByRole("link", { name: "World Tech Summit" }),
  ).toHaveText("World Tech Summit");

  const eventTitle1 = await cards
    .filter({ hasText: "World Tech Summit" })
    .getByRole("heading")
    .innerText();

  await bookNow(page);

  const customerName = faker.person.fullName();
  const customerEmail = faker.internet.email();
  const customerPhone = faker.phone.number({ style: "national" });

  let bookingRefValue = await bookingAssertion(page, {
    quantity: 1,
    customerName: customerName,
    customerEmail: customerEmail,
    phone: customerPhone,
  });

  expect(typeof bookingRefValue).toBe("string");
  expect(bookingRefValue.trim().length).toBeGreaterThan(0);
  // Capture booking 1 details fro+m success page
  // Capture booking 1 title from success page

  const eventTitileOnBookingPage = await page
    .getByRole("heading", { name: "World Tech Summit" })
    .innerText();

  // Capture booking 1 TicketCount  from success page
  const eventTicketsCountOnBookingPage = await page
    .locator(".flex.items-center.justify-between.text-sm")
    .filter({ hasText: "Tickets" })
    .locator("span")
    .nth(1)
    .innerText();

  // Capture booking 1 Ticket Price from success page
  const eventTicketsPriceOnBookingPage = await page
    .locator(".flex.items-center.justify-between.text-sm")
    .filter({ hasText: "Total" })
    .locator("span")
    .nth(1)
    .innerText();

  console.log("Booking 1 — Title:", eventTitileOnBookingPage);
  console.log("Booking 1 — Tickets:", eventTicketsCountOnBookingPage);
  console.log("Booking 1 — Total Price:", eventTicketsPriceOnBookingPage);

  const clickReturnToEvents = await page
    .getByRole("main")
    .getByRole("link", { name: "Events", exact: true })
    .click();
  const cards1 = await createBookingFromFilters(page, {
    searchText: "Dilli",
    category: "Festival",
    city: "Delhi",
  });
  // const eventTitle2 = await cards1.filter({ hasText: 'Dilli Diwali Mela' }).getByRole('heading').innerText();
  //     console.log(eventTitle2)
  await page.waitForTimeout(5000);
  await bookNow(page);
  let bookingRefValue2 = await bookingAssertion(page, {
    quantity: 2,
    customerName: customerName,
    customerEmail: customerEmail,
    phone: customerPhone,
  });

  const eventTitleOnBookingPage2 = await page
    .getByRole("heading", { name: "Dilli Diwali Mela" })
    .innerText();

  const ticketCount2 = await page
    .locator(".flex.items-center.justify-between.text-sm")
    .filter({ hasText: "Tickets" })
    .locator("span")
    .nth(1)
    .innerText();

  const totalPrice2 = await page
    .locator(".flex.items-center.justify-between.text-sm")
    .filter({ hasText: "Total" })
    .locator("span")
    .nth(1)
    .innerText();
  console.log("Booking 2 — Title:", eventTitleOnBookingPage2);
  console.log("Booking 2 — Tickets:", ticketCount2);
  console.log("Booking 2 — Total Price:", totalPrice2);

  // await page.waitForTimeout(5000)
  // await bookNow(page);
  expect(bookingRefValue2).not.toBe(bookingRefValue);
  expect(eventTitle1).not.toBe(eventTitleOnBookingPage2);
  //bookingRefs.push(bookingRefValue);
  //bookingRefs.push(bookingRefValue2);
  console.log(" Booking Refs Value2:", bookingRefValue2);
  fs.writeFileSync(
    Booking_Refs_File,
    JSON.stringify(
      {
        booking1: {
          bookingRefValue,
          eventTitle: eventTitileOnBookingPage,
          ticketCount: eventTicketsCountOnBookingPage,
          totalPrice: eventTicketsPriceOnBookingPage,
           customerName: customerName,
          customerEmail: customerEmail,
          phone: customerPhone,
        },
        booking2: {
          bookingRefValue: bookingRefValue2,
          eventTitle: eventTitleOnBookingPage2,
          ticketCount: ticketCount2,
          totalPrice: totalPrice2,
          customerName: customerName,
          customerEmail: customerEmail,
          phone: customerPhone,
        },
      },
      null,
      2,
    ),
  );
  console.log("Saved booking refs to bookingRefs.json");
  console.log(" File written to:", Booking_Refs_File);
  console.log(" Contents:", { bookingRefValue, bookingRefValue2 });
});

test("Guard against accidental index-based logic", async ({ page }) => {
  if (!fs.existsSync(Booking_Refs_File)) {
    throw new Error(
      'bookingRefs.json not found — run "Create Booking From Filters" test first',
    );
  }
  const saved = JSON.parse(fs.readFileSync(Booking_Refs_File, "utf-8"));
  const bookingRefValue = saved.booking1.bookingRefValue;
  const bookingRefValue2 = saved.booking2.bookingRefValue;

  console.log("Read from JSON — Ref 1:", bookingRefValue);
  console.log("Read from JSON — Ref 2:", bookingRefValue2);
  await page.goto("/login");
  await login(page, "revasingh9@yahoo.in", "Mall##ika30");
  await page.getByRole("link", { name: "My Bookings" }).first().click();
  const Singlecard = await locateEventBookingCard(page, bookingRefValue);
  const cardInformation = await extractBookingCardDetails(Singlecard, bookingRefValue);
  await writeBookingDataToFile(cardInformation)



  const saved1 = JSON.parse(
    fs.readFileSync(Booking_Refs_InputFile_Data, "utf-8"),
  );
  // console.log('JSON structure:', JSON.stringify(saved1, null, 2));

  const {
    bookingRefValue: bookingRef,
    labelConfirmText: labelConfirmText,
    eventTitle: labelgeteventMyBookingTitle,
    ticketCount: ticketCount,
    totalPrice: labelMyBookingTicketPrice,
    customerName: customerName,
    customerEmail: customerEmail,
    phone: customerPhone,
  } = saved1;
  expect(saved.booking1.bookingRefValue).toBe(saved1.bookingRefValue);
  expect(labelConfirmText).toContain("confirmed");
  expect(saved.booking1.eventTitle).toBe(saved1.eventTitle);
  expect(saved.booking1.ticketCount).toBe(saved1.ticketCount);
  expect(saved.booking1.totalPrice).toBe(saved1.totalPrice)

 // const bookingRefTwo = await WriteFileWithBookingInfor(page, bookingRefValue2);
    const Singlecard1 = await locateEventBookingCard(page, bookingRefValue2);
  const cardInformation1 = await extractBookingCardDetails(Singlecard1, bookingRefValue2);
  await writeBookingDataToFile(cardInformation1)
  
  const saved2 = JSON.parse(
    fs.readFileSync(Booking_Refs_InputFile_Data, "utf-8"),
  );
  expect(saved.booking2.bookingRefValue).toBe(saved2.bookingRefValue);
  expect(labelConfirmText).toContain("confirmed");
  expect(saved.booking2.eventTitle).toBe(saved2.eventTitle);
  expect(saved.booking2.ticketCount).toBe(saved2.ticketCount);
  expect(saved.booking2.totalPrice).toBe(saved2.totalPrice);

  const bookingCard = page.locator("#booking-card");
  //   const getConfirmedText = await bookingRefValue.locator(`span:has-text("confirmed")`).innerText()
  //   console.log("Get Confirmed Text:",getConfirmedText)
});

test('Open the first booking detail page and cross-check all sections',async({page}) => {
if (!fs.existsSync(Booking_Refs_File)) {
    throw new Error(
      'bookingRefs.json not found — run "Create Booking From Filters" test first',
    );
  }
  const saved = JSON.parse(fs.readFileSync(Booking_Refs_File, "utf-8"));
  const bookingRefValue = saved.booking1.bookingRefValue;
  const bookingRefValue2 = saved.booking2.bookingRefValue;
await page.goto("/login");
  await login(page, "revasingh9@yahoo.in", "Mall##ika30");
  await page.getByRole("link", { name: "My Bookings" }).first().click();

  const Singlecard = await locateEventBookingCard(page, bookingRefValue);
const viewCardDetail1 =await viewCardDetail(page,Singlecard,bookingRefValue)
expect(viewCardDetail1.breadCrumb).toEqual(bookingRefValue)
expect(viewCardDetail1.viewDetailsEventTitleText).toContain(saved.booking1.eventTitle)
expect(viewCardDetail1.viewDetailsCustomerNameText).toContain(saved.booking1.customerName)
expect(viewCardDetail1.viewDetailsCustomerEmail).toMatch(saved.booking1.customerEmail.toLowerCase())
expect(viewCardDetail1.viewDetailsCustomerPhone).toContain(saved.booking1.phone)
expect(viewCardDetail1.viewDetailsPaymentSummaryTicketCount).toEqual(saved.booking1.ticketCount)
expect(viewCardDetail1.viewDetailsPaymentSummaryTotalTicketPrice).toEqual(saved.booking1.totalPrice)
expect(typeof viewCardDetail1.numericValueBookingID).toBe('number')

})

test('Return and validate the second booking detail page',async({page})=> {
  if (!fs.existsSync(Booking_Refs_File)) {
    throw new Error(
      'bookingRefs.json not found — run "Create Booking From Filters" test first',
    );
  }
  const saved = JSON.parse(fs.readFileSync(Booking_Refs_File, "utf-8"));
  const bookingRefValue = saved.booking1.bookingRefValue;
  const bookingRefValue2 = saved.booking2.bookingRefValue;
await page.goto("/login");
  await login(page, "revasingh9@yahoo.in", "Mall##ika30");
  await page.getByRole("link", { name: "My Bookings" }).first().click();

  const Singlecard = await locateEventBookingCard(page, bookingRefValue2);
const viewCardDetail1 =await viewCardDetail(page,Singlecard,bookingRefValue2)
expect(viewCardDetail1.breadCrumb).toEqual(bookingRefValue2)
expect(viewCardDetail1.viewDetailsEventTitleText).toContain(saved.booking2.eventTitle)
expect(viewCardDetail1.viewDetailsCustomerNameText).toContain(saved.booking2.customerName)
expect(viewCardDetail1.viewDetailsCustomerEmail).toMatch(saved.booking2.customerEmail.toLowerCase())
expect(viewCardDetail1.viewDetailsCustomerPhone).toContain(saved.booking2.phone)
expect(viewCardDetail1.viewDetailsPaymentSummaryTicketCount).toEqual(saved.booking2.ticketCount)
expect(viewCardDetail1.viewDetailsPaymentSummaryTotalTicketPrice).toEqual(saved.booking2.totalPrice)
expect(typeof viewCardDetail1.numericValueBookingID).toBe('number')
expect(viewCardDetail1.breadCrumb).not.toContain(bookingRefValue)
expect(viewCardDetail1.viewDetailsEventTitleText).not.toContain(saved.booking1.eventTitle)
 
})