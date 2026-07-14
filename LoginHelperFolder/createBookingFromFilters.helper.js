const { expect } = require("@playwright/test");
const fs = require("fs");
const path = require("path");
const Booking_Refs_InputFile_Data = path.resolve(
  process.cwd(),
  "Data",
  "bookingRefsData.json",
);

async function createBookingFromFilters(page, { searchText, category, city }) {
  await page.getByPlaceholder("Search events, venues…").fill(searchText);
  const categoryDropDownOptionMenu = page.getByRole("combobox").first();
  await expect(categoryDropDownOptionMenu).toBeVisible();
  const valueOfCategoryDropDownOption = await categoryDropDownOptionMenu
    .locator("option")
    .allInnerTexts();
  console.log(valueOfCategoryDropDownOption);
  await categoryDropDownOptionMenu.selectOption({ value: category });
  const categoryDropDownOptionMenu1 = page.getByRole("combobox").nth(1);
  const valueOfCategoryDropDownOption1 =
    await categoryDropDownOptionMenu1.allInnerTexts();
  console.log(valueOfCategoryDropDownOption1);
  await categoryDropDownOptionMenu1.selectOption({ label: city });
  const cards = page.locator('[data-testid="event-card"]');
  await expect(cards.first()).toBeVisible();
 const eventTitleReadFromCard =  await cards
    .filter({ hasText: "World Tech Summit" })
    .getByRole("heading")
    .innerText();
  console.log("Event Title:", eventTitleReadFromCard);

  return {
    cards,
    eventTitleReadFromCard,
  };

}

async function bookingAssertion(
  page,
  { quantity, customerName, customerEmail, phone },
) {
  const countTickets = page.locator("#ticket-count");
  var getTicketCountText = await countTickets.innerText();
  console.log("TicketCountText :", getTicketCountText);
  getTicketCountText = parseInt(await countTickets.innerText());
  const plusButton = page.getByRole("button", { name: "+" });
  const minusButton = page.getByRole("button", { name: "-" });

  while (getTicketCountText !== quantity) {
    if (getTicketCountText < quantity) {
      await plusButton.click();
    } else {
      await minusButton.click();
    }

    getTicketCountText = parseInt(await countTickets.innerText());
  }
  expect(getTicketCountText).toBe(parseInt(quantity));
  const customerNameTextBox = await page
    .getByRole("textbox", { name: "Full Name*" })
    .fill(customerName);

  const customerEmailTextBox = await page
    .getByRole("textbox", { name: /email/i })
    .fill(customerEmail);

  const custPhoneNumber = await page
    .getByRole("textbox", { name: /phone number/i })
    .fill(phone);
  const confirmBookingButton = await page
    .getByRole("button", { name: "Confirm Booking" })
    .click();
  const bookingRef = await page
    .locator(".flex.items-center.justify-between.text-sm")
    .filter({ hasText: "Booking Ref" });
  //const bookingRef = page.getByText(/^Booking Ref/)
  const getBookingRefText = await bookingRef.innerText();
  console.log("Booking Ref:", getBookingRefText);
  const bookingRefValue = await getBookingRefText
    .replace("Booking Ref", "")
    .trim();
  console.log(bookingRefValue);

  return bookingRefValue;
}

async function bookNow(page) {
  const bookNowButton = page.getByRole("link", { name: "Book Now" });
  await bookNowButton.click();
}

async function locateEventBookingCard(page, bookingRef) {
  // Function — just finds and returns the single card locator
  const bookingcard = page.locator("#booking-card");
  await bookingcard.first().waitFor({ state: "visible" });

  const getBookingCardCount = await bookingcard.count();

  for (let i = 0; i < getBookingCardCount; i++) {
    const singleCard = bookingcard.nth(i);
    const refText = await singleCard.locator(".booking-ref").textContent();

    if (!refText) continue;

    if (refText.trim() === bookingRef.trim()) {
      console.log(`Found card at index ${i} for ref: ${bookingRef}`);
      return singleCard; //return the whole card locator
    }
  }

  throw new Error(`Booking ref "${bookingRef}" not found on page`);
}

async function viewCardDetail(page,card, bookingRef){
    const viewDetailsBookingCards = await card.getByRole('button', {name:'View Details'}).click()
     const breadCrumb =await page.locator('.text-gray-900.font-mono').textContent()
     const viewDetailsEventTitle = await page.getByRole('heading',{ level: 1 })
  const viewDetailsEventTitleText = await viewDetailsEventTitle.textContent()


  const customerDetailsCard = page.locator('.bg-white.rounded-2xl.border.border-gray-100.shadow-sm.p-6').filter({ hasText: 'Customer Details' })
  const viewDetailsCustomerInformation = await customerDetailsCard.locator('.flex.justify-between.items-start.gap-4')
  const viewDetailsCustomerNameText = await viewDetailsCustomerInformation.filter({ hasText: /name/i })
  .locator('span').nth(1)
  .innerText()

  const viewDetailsCustomerEmail = await viewDetailsCustomerInformation
   .filter({ hasText: /email/i })
  .locator('span').nth(1)
  .innerText();

 const viewDetailsCustomerPhone = await viewDetailsCustomerInformation
.filter({ hasText: /phone/i })
  .locator('span').nth(1)
  .innerText();
  console.log('Name:', viewDetailsCustomerNameText);
console.log('Phone:', viewDetailsCustomerPhone);
console.log('Email:',viewDetailsCustomerEmail);
  const paymentSummaryDetailsCard = page.locator('.bg-white.rounded-2xl.border.border-gray-100.shadow-sm.p-6')
  .filter({ hasText: 'Payment Summary' })
   //const viewDetailsPaymentSummary = await paymentSummaryDetailsCard
   const viewDetailsPaymentSummaryTicketCount = await paymentSummaryDetailsCard.filter({ hasText: /ticket/i })
  .locator('span').nth(1)
  .innerText()
  const viewDetailsPaymentSummaryTotalTicketPrice = await paymentSummaryDetailsCard
  .filter({ hasText: /Total Paid/i })
  .locator('span').last()
 .innerText()
  
 const bookingInformationCard = page.locator('.bg-white.rounded-2xl.border.border-gray-100.shadow-sm.p-6')
  .filter({ hasText: 'Booking Information' })
  const viewDetailsBookingID= await bookingInformationCard.filter({ hasText: /Booking ID/i })
  .locator('span').last()
  .innerText()
  const numericValueBookingID = parseInt(viewDetailsBookingID.trim())
  console.log('Ticket Count:', viewDetailsPaymentSummaryTicketCount);
console.log('Total Price:', viewDetailsPaymentSummaryTotalTicketPrice);
console.log('Booking ID:', viewDetailsBookingID);

return {
    breadCrumb: breadCrumb,
    viewDetailsEventTitleText:viewDetailsEventTitleText,
    viewDetailsCustomerNameText: viewDetailsCustomerNameText,
    viewDetailsCustomerEmail: viewDetailsCustomerEmail,
    viewDetailsCustomerPhone: viewDetailsCustomerPhone,
    viewDetailsPaymentSummaryTicketCount: viewDetailsPaymentSummaryTicketCount,
    viewDetailsPaymentSummaryTotalTicketPrice:viewDetailsPaymentSummaryTotalTicketPrice,
    numericValueBookingID:numericValueBookingID
  };


}
async function extractBookingCardDetails(card, bookingRef) {
  const labelConfirmText = await card
    .locator(".ring-emerald-200")
    .textContent();

  const labelgeteventMyBookingTitle = await card
    .getByRole("heading")
    .textContent();

  const labelMyBookingTicketCount = await card
    .getByText(/\d+\s+ticket[s]?/i)
    .textContent();
  const ticketCount = labelMyBookingTicketCount.match(/\d+/)[0];

  const labelMyBookingTicketPrice = await card
    .locator(".text-xl.font-bold.text-indigo-700")
    .textContent();



  // Return all values as an object
  return {
    bookingRefValue: bookingRef,
    labelConfirmText: labelConfirmText,
    eventTitle: labelgeteventMyBookingTitle,
    ticketCount: ticketCount,
    totalPrice: labelMyBookingTicketPrice,
  };
}
function writeBookingDataToFile(bookingDetails) {
  fs.writeFileSync(
    Booking_Refs_InputFile_Data,
    JSON.stringify(bookingDetails, null, 2),
  );
  console.log("Written booking data to file:", Booking_Refs_InputFile_Data);
  console.log("Data written:", bookingDetails);
}
module.exports = {
  createBookingFromFilters,
  bookingAssertion,
  bookNow,
  locateEventBookingCard,
  extractBookingCardDetails,
  writeBookingDataToFile,
  viewCardDetail
};
