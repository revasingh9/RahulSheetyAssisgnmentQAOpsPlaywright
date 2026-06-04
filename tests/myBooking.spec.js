const { test,expect } = require('@playwright/test')
const { loginUserNamePassword } = require('../LoginHelperFolder/loginUserNamePassword.helper')
const { patchBookingsList,mutateBooking } = require('../LoginHelperFolder/patchBookingsList.helper')
const { patchBookingDetail } = require('../LoginHelperFolder/patchBookingsDetail.helper')
const { findBookingCardByRef } = require('../LoginHelperFolder/findBookingCardByRef.helper')
const { parseCurrency } = require('../LoginHelperFolder/parseCurrency.helper')
const { parseTicketCount } = require('../LoginHelperFolder/parseTicketCount.helper')

const fs = require("fs");
const path = require("path");
const OriginalCustomerDetails= path.resolve(
  process.cwd(),
  "Data",
  "CustomerDetails.json",
);

test('Sign in and open My Bookings with one patched list record',async({page})=>{
   
  await page.goto('/');
  await loginUserNamePassword(page,process.env.LOGIN_EMAIL, process.env.LOGIN_PASSWORD)  // Login Successfully
  
  // Set up route interception  /api/bookings?page=1&limit=10 
  const getPatchedState = await patchBookingsList(page, mutateBooking);
  console.log('Stored patched booking for assertions:', getPatchedState);
  
  const{ title, totalPrice, quantity } = getPatchedState.mutateBooking
  console.log('Patched bookingRef:', getPatchedState.mutateBooking.bookingRef);
  console.log('Patched title:', title);
  console.log('Patched totalPrice:', totalPrice);
  console.log('Patched quantity:', quantity);

  // Now navigate to My Bookings (this will trigger the intercepted API call)
  await page.getByRole('link',{ name: /my bookings/i }).first().click();
  
  // Wait for the route to be triggered and get the patched booking
  const patchedBooking = await getPatchedState.routePromise;
  console.log('Patchedooking from route:', patchedBooking);
  console.log('Booking ID:', patchedBooking?.id);
  
  // Verify the patched data appears in the UI
  await expect(page.getByRole('heading', { name: title })).toBeVisible();
const foundBookingCard = await findBookingCardByRef(page, getPatchedState.mutateBooking.bookingRef);
await expect(foundBookingCard).toBeVisible();
await expect(foundBookingCard.locator('.booking-ref')).toHaveText(getPatchedState.mutateBooking.bookingRef);
await expect(foundBookingCard.getByRole('heading', { name: title })).toHaveText(title);
//await expect(foundBookingCard.locator('.text-xl.font-bold.text-indigo-700')).toHaveText(new RegExp(totalPrice));
const priceText = await foundBookingCard.locator('.text-xl.font-bold.text-indigo-700').innerText();
console.log('Raw price text:', priceText);
const numericPrice = await parseCurrency(priceText);
console.log('Numeric price:', numericPrice);
expect(numericPrice).toBe(parseInt(totalPrice));
const ticketCount = await foundBookingCard.getByText(/\d+\s+tickets?/i).innerText();
console.log('Raw ticket count text:', ticketCount);
const parsedTicketCount = await parseTicketCount(ticketCount);
console.log('Parsed ticket count:', parsedTicketCount);
expect(parsedTicketCount).toBe(parseInt(quantity));
//Expected: At least one other booking card still shows a different live reference or title, proving only one record was altered
const allBookingCardsRef = await page.locator(".booking-ref ").allTextContents();
console.log('All booking refs on page:', allBookingCardsRef);
const allBookingCardsTitles = await page.locator('[data-testid="booking-card"]').getByRole('heading').allTextContents();
console.log('All booking titles on page:', allBookingCardsTitles);
const otherCardWithSameRef = allBookingCardsRef.filter(ref => ref.trim() === getPatchedState.mutateBooking.bookingRef.trim()).length > 1;
const otherCardWithSameTitle = allBookingCardsTitles.filter(t => t.trim() === title.trim()).length > 1;
expect(otherCardWithSameRef).toBeFalsy();
expect(otherCardWithSameTitle).toBeFalsy();
//const foundBookingCard1 = await findBookingCardByRef(page, getPatchedState.mutateBooking.bookingRef);
console.log('Booking ID:',patchedBooking?.id);
console.log('patchedBooking=', JSON.stringify(patchedBooking, null, 2));

// Set up the detail route BEFORE clicking the button - returns a promise that resolves when route is triggered
const detailPromise = patchBookingDetail(page, patchedBooking);


await page.getByRole('button', { name: /view details/i }).first().click();

// Now await the detail promise to get the intercepted response
const detailPatchedBooking = await detailPromise;
// console.log('patchedBooking = ', patchedBooking);
// console.log('patchedBooking = ', detailPatchedBooking);
// console.log('Intercepting: ', `**/api/bookings/${patchedBooking?.id}`);

console.log('Current URL:', page.url());
//Expected: Browser navigates to the detail page for the preserved booking id from your patched object
await expect(page).toHaveURL(new RegExp(`/bookings/${patchedBooking?.id}$`));
  console.log('After wait:', page.url());
  
  console.log('Patched booking detail from route:', detailPatchedBooking);
  console.log('Detail Booking ID:', detailPatchedBooking.data.id);
  console.log('Detail bookingRef:', detailPatchedBooking.data.bookingRef);
  console.log('Detail Quantity:', detailPatchedBooking.data.quantity);
  console.log('Detail Total Price:', detailPatchedBooking.data.totalPrice);
  console.log('Detail Title:', detailPatchedBooking.data.title);
  //Expected: The event title (h1) equals the patched event title
  await expect(page.getByRole('heading').first()).toHaveText(detailPatchedBooking.data.title);
  await expect(page.getByRole('heading', { name: detailPatchedBooking.data.title })).toBeVisible();
  await expect(page.getByText(/[A-Z]{3}-[A-Za-z0-9]+/).nth(1)).toHaveText(detailPatchedBooking.data.bookingRef);
  await expect(page.locator('.font-mono.font-bold.text-indigo-600 ').filter({ hasText: new RegExp(detailPatchedBooking.data.bookingRef, 'i') })).toBeVisible();
 
  //Expected: Payment Summary tickets equals the patched ticket count
   const paymentSummaryDetailsCard = page.locator('.bg-white.rounded-2xl.border.border-gray-100.shadow-sm.p-6')
  .filter({ hasText: 'Payment Summary' })
  const viewDetailsPaymentSummaryTicketCount = await paymentSummaryDetailsCard.filter({ hasText: /ticket/i })
  .locator('span').nth(1)
  .innerText()

console.log('Payment Summary tickets text:', viewDetailsPaymentSummaryTicketCount);
await expect(viewDetailsPaymentSummaryTicketCount).toContain(detailPatchedBooking.data.quantity);
//Expected: Total Paid equals the patched total amount
const viewDetailsPaymentSummaryTotalTicketPrice = await paymentSummaryDetailsCard
  .filter({ hasText: /Total Paid/i })
  .locator('span').last()
 .innerText()
 await expect(viewDetailsPaymentSummaryTotalTicketPrice).toContain(detailPatchedBooking.data.totalPrice); 
 //Customer Details email still equals the original live email from the fetched response
 const saved1 = JSON.parse(fs.readFileSync(OriginalCustomerDetails, "utf-8")  );
(console.log('Original customer email:', saved1.data.customerEmail)) 
await expect(saved1.data.customerEmail).toBe(detailPatchedBooking.data.customerEmail);
//Expected: The breadcrumb ends with the patched booking reference
     const breadCrumb =await page.locator('.text-gray-900.font-mono').textContent()
     await expect(breadCrumb).toContain(detailPatchedBooking.data.bookingRef);
     await page.getByRole('button', { name: /back to my bookings/i }).click();

     const matchBookingCard = await findBookingCardByRef(page, getPatchedState.mutateBooking.bookingRef);
const ref1 = await foundBookingCard.locator('.booking-ref').textContent();
const ref2 = await matchBookingCard.locator('.booking-ref').textContent();

expect(ref1).toBe(ref2);
     const priceText1 = await foundBookingCard.locator('.text-xl.font-bold.text-indigo-700').innerText();
console.log('Raw price text:', priceText1);
const numericPrice1 = await parseCurrency(priceText);
console.log('Numeric price:', numericPrice1);
expect(numericPrice1).toBe(parseInt(detailPatchedBooking.data.totalPrice));
//Expected: Its total amount still matches the patched value shown on the detail page


})