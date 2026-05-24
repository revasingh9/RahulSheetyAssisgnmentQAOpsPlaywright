const { expect } = require("@playwright/test");
const fs = require('fs')
const path = require('path')
const  Booking_Refs_InputFile_Data =path.resolve(process.cwd(), 'Data', 'bookingRefsData.json');

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

  return cards;
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


async function findBookingCardByRef(page, bookingRef) {
    const bookingcard =  page.locator('#booking-card')
     await bookingcard.first().waitFor({ state: 'visible' });
  const getBookingRefLocator = await bookingcard.locator(".booking-ref");
  await page.waitForTimeout(5000)
  const getConfirmedText = await bookingcard.locator(".ring-emerald-200");
  const geteventTitle = await bookingcard.getByRole('heading')
  const getTicketCount = await bookingcard.getByText(/\d+\s+ticket[s]?/i);
   const getTicketPrice = await bookingcard.locator('.text-xl.font-bold.text-indigo-700')

  
  const getBookingCardCount = await bookingcard.count();
  console.log('Total booking refs found on page:', getBookingCardCount);
  for (let i = 0; i < getBookingCardCount; i++) {
    const getsingleBookingRefText = getBookingRefLocator.nth(i);
    const refText = await getsingleBookingRefText.textContent();
    console.log(`Checking ref ${i}:"${refText?.trim()}"`);

    if (refText && refText.trim() === bookingRef.trim()) {
      console.log(`Found card for ref: ${bookingRef}`);
      const confirmedText = getConfirmedText.nth(i);
    const labelConfirmText = await confirmedText.textContent();
    const geteventMyBookingTitle = geteventTitle.nth(i)
    const labelgeteventMyBookingTitle = await geteventMyBookingTitle.textContent();
    const geteventMyBookingTicketCount = await getTicketCount.nth(i)
    const labelMyBookingTicketCount = await geteventMyBookingTicketCount.textContent()
    const ticketCount =  labelMyBookingTicketCount.match(/\d+/)[0];
    const geteventMyBookingTicketPrice= await getTicketPrice.nth(i)
    const labelMyBookingTicketPrice = await geteventMyBookingTicketPrice.textContent()

      console.log("confirm text",labelConfirmText)
      console.log('Label Get Event MyBookingTitle:',labelgeteventMyBookingTitle)
       console.log('Label MyBooking Ticket Count:',ticketCount)
        console.log('Label MyBooking Ticket Price:' ,labelMyBookingTicketPrice)
      expect(labelConfirmText).toContain('confirmed')
      fs.writeFileSync(Booking_Refs_InputFile_Data, JSON.stringify(
              {
                  bookingRefValue:bookingRef,
                  labelConfirmText: labelConfirmText,
                  eventTitle:labelgeteventMyBookingTitle,
                  ticketCount: ticketCount,
                 totalPrice: labelMyBookingTicketPrice ,
                         

              },
              null,
              2
          )
          );
      return getsingleBookingRefText;
    }

}
}
module.exports = {
  createBookingFromFilters,
  bookingAssertion,
  bookNow,
  findBookingCardByRef,
};
