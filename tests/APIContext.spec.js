 const{test,expect} = require('@playwright/test')
const playwright = require('@playwright/test');
const{ createAuthorizedApiContext } = require ('../LoginHelperFolder/createAuthorizedApiContext.helper')
const{injectTokenBeforeNavigation} = require('../LoginHelperFolder/injectTokenBeforenavigation.helper')
const { findBookingCardByRef } = require('../LoginHelperFolder/findBookingCardByRef.helper')
const { createBooking } = require('../LoginHelperFolder/createBooking.helper')
const { selectBookableEvent } = require ('../LoginHelperFolder/selectBookableEvent.helper')
const { lookupBookingByRef } = require('../LoginHelperFolder/lookupBookingByRef.helper')
const {parseSeatCount} = require('../LoginHelperFolder/parseSeatCount.helper')
const { parseTicketCount } = require('../LoginHelperFolder/parseTicketCount.helper')
const{parseCurrency} = require('../LoginHelperFolder/parseCurrency.helper')

test('Select a live event and create a booking through the API', async ({ page }) => {
    // Step 1: Select a live event and create a booking through the API
    const customerName = 'Test User'
    const customerEmail = 'testuser@gmail.com'
    const customerPhone = '4056789009'
    const quantity = 2
    
    // Create authorized API context and keep token
    const { apiContext, token } = await createAuthorizedApiContext(playwright, process.env.LOGIN_EMAIL, process.env.LOGIN_PASSWORD)
    
    // Select a live event with at least 2 available seats
    const { id: eventId, title, category, city, price, availableSeats } = await selectBookableEvent(apiContext, 2)
    
    // Build booking payload
    const payLoad = { eventId, customerName, customerEmail, customerPhone, quantity }
    
    // Create the booking
    const { success, bookId, bookingRef } = await createBooking(apiContext, payLoad, token)
    console.log('Booking created - ID:', bookId, 'Ref:', bookingRef)
    
    // Calculate expected total
    const expectedTotal = (quantity * price)
    
    // Step 2: Verify the same booking can be found by reference through the API
    const lookupResult = await lookupBookingByRef(apiContext, bookId, token) 
    //I am using bookId instead of bookingRef because the API endpoint for lookup is based on booking ID, not reference. The bookingRef is returned in the lookup response and can be asserted against the original bookingRef from the create response.
//Expected: The returned booking id matches the id from the create response
    await expect(lookupResult.success).toBeTruthy()
    await expect(lookupResult.data.id).toBe(bookId)
    //Expected: The returned reference code matches exactly
    await expect(lookupResult.data.bookingRef).toBe(bookingRef)
    //Expected: The returned ticket quantity and total amount match the quantity and computed total from Step 1
    
    await expect(lookupResult.data.quantity).toBe(quantity)
    await expect((lookupResult.data.totalPrice).toString()).toBe(parseFloat(expectedTotal.toString()).toString())
    
    // Step 3: Open My Bookings and locate the same record in the UI
    // Seed the authenticated session into the browser BEFORE first navigation
    await injectTokenBeforeNavigation(page, token)
    
    // Navigate to My Bookings page
    await page.goto('/bookings')
    
    // Verify "My Bookings" heading is visible
    await expect(page.getByRole('heading', { name: 'My Bookings' })).toBeVisible()
    
    // Find the booking card by reference
    const matchedCard = await findBookingCardByRef(page, bookingRef)
    
    // Verify the card heading equals the runtime-selected event title
    const cardTitle = await matchedCard.getByRole('heading').textContent()
    await expect(cardTitle).toContain(title)
    
    // Verify the booking reference on the card
    const cardBookingRef = await matchedCard.locator('.booking-ref').textContent()
    await expect(cardBookingRef.trim()).toBe(bookingRef)
    
  const ticketCountOnBookingCardLocator = await matchedCard.getByText(/\d+\s+tickets?/i).first()
    const ticketCountText = await ticketCountOnBookingCardLocator.innerText()
    console.log(ticketCountText);
    const parsedTicketCount = await parseTicketCount(ticketCountText);
    console.log('Parsed ticket count:', parsedTicketCount);
    await expect(parsedTicketCount).toBe(parseInt(quantity));
       
    const totalAmount = await matchedCard.locator('.text-xl.font-bold.text-indigo-700').textContent()
    const parsedAmount = await parseCurrency(totalAmount);
    console.log('Parsed total amount:', parsedAmount);
    await expect(parsedAmount).toBe(expectedTotal)

    await page.getByRole('button', { name: 'View Details' }).first().click()
    //Expected: Browser navigates to /bookings/{bookingId}
    await expect(page).toHaveURL(new RegExp(`/bookings/${bookId}$`))
    //Expected: The breadcrumb ends with the stored booking reference code
    const breadCrumb =await page.locator('.text-gray-900.font-mono').textContent()
    console.log('Breadcrumb text:', breadCrumb);
    console.log('Stored Booking Reference Code:', bookingRef);
     await expect(breadCrumb).toContain(bookingRef);
//Expected: Event Details matches the runtime-selected event title, category, and venue or city information
await expect(page.getByRole('heading').first()).toHaveText(title);
  const eventDetailsSummaryCard = await page.locator('.p-6')
  .filter({ hasText: 'Event Details' })
   const viewDetailsCityName = await eventDetailsSummaryCard.filter({ hasText: /City/i })
  .locator('span').nth(9)
  .innerText()
console.log('Event Details city text:',viewDetailsCityName);
  const viewDetailsCategoryName = await eventDetailsSummaryCard.filter({ hasText: /Category/i })
  .locator('span').nth(3)
  .innerText()
console.log('Event Details category text:',viewDetailsCategoryName);
await expect(viewDetailsCategoryName).toContain(category);
await expect(viewDetailsCityName).toContain(city);
//Expected: Payment Summary shows 2 tickets and the expected total paid amount
 const paymentSummaryDetailsCard = page.locator('.bg-white.rounded-2xl.border.border-gray-100.shadow-sm.p-6')
  .filter({ hasText: 'Payment Summary' })
  const viewDetailsPaymentSummaryTicketCount = await paymentSummaryDetailsCard.filter({ hasText: /ticket/i })
  .locator('span').nth(1)
  .innerText()

console.log('Payment Summary tickets text:', viewDetailsPaymentSummaryTicketCount);
await expect(viewDetailsPaymentSummaryTicketCount).toContain(quantity.toString());
//Expected: Total Paid equals the patched total amount
const viewDetailsPaymentSummaryTotalTicketPrice = await paymentSummaryDetailsCard
  .filter({ hasText: /Total Paid/i })
  .locator('span').last()
 .innerText()
 const parsedTotalPaid = await parseCurrency(viewDetailsPaymentSummaryTotalTicketPrice);
 console.log('Parsed Total Paid:', parsedTotalPaid);
 await expect(parsedTotalPaid).toBe(expectedTotal);
 //await expect(viewDetailsPaymentSummaryTotalTicketPrice).toContain(expectedTotal);
 const customerEmailOnCustomkerDetails = await page.locator('.bg-white.rounded-2xl.border.border-gray-100.shadow-sm.p-6')
  .filter({ hasText: 'Customer Details' })
  .locator('span').nth(3)
  .innerText()
  console.log('Customer email on Customer Details:', customerEmailOnCustomkerDetails);
  await expect(customerEmailOnCustomkerDetails).toBe(customerEmail);
  //Delete the booking using DELETE /bookings/{bookingId} from the same authenticated API context

 const deleteBookingResponse = await apiContext.delete(`https://api.eventhub.rahulshettyacademy.com/api/bookings/${bookId}`, {
    headers: {
        Authorization: `Bearer ${token}`
    }
})
expect(deleteBookingResponse.ok()).toBeTruthy();
const deleteResponseJson = await deleteBookingResponse.json()
console.log('Delete booking response:', deleteResponseJson)
//Expected: The delete response is successful
await expect(deleteBookingResponse.ok()).toBeTruthy()
//Look up the booking again using lookupBookingByRef(apiContext, bookingRef)


 const lookupResult1 = await lookupBookingByRef(apiContext, bookId, token) 
 console.log('Lookup bookingRef:', bookId);
    await expect(lookupResult1.success).toBeFalsy()
 await page.getByRole('main').getByRole('link', { name: 'My Bookings', exact: true }).click();
    await page.reload();
       const matchedCard1 = await findBookingCardByRef(page, bookingRef)
//          const cardBookingRef1 = await matchedCard1.locator('.booking-ref').textContent()
    await expect(matchedCard1).toBeNull()
    //Dispose the API context when the cleanup flow is complete
    await apiContext.dispose()
 });