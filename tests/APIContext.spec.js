 const{test,expect} = require('@playwright/test')
const playwright = require('@playwright/test');
const{ createAuthorizedApiContext } = require ('../LoginHelperFolder/createAuthorizedApiContext.helper')
const{injectTokenBeforeNavigation} = require('../LoginHelperFolder/injectTokenBeforenavigation.helper')
const { findBookingCardByRef } = require('../LoginHelperFolder/findBookingCardByRef.helper')
const { createBooking } = require('../LoginHelperFolder/createBooking.helper')
const { selectBookableEvent } = require ('../LoginHelperFolder/selectBookableEvent.helper')

test('Select a live event and create a booking through the API', async ({ page }) => {
    // const payLoad = {'Test User','testuser@gmail.com','4056789009',2}
   // const payLoad = {customerName, customerEmail, customerPhone,quantity}
   const customerName = 'Test User'
   const customerEmail ='testuser@gmail.com'
   const customerPhone = '4056789009'
   const quantity = 2 
   //const payLoad = {eventId, customerName, customerEmail, customerPhone,quantity}
    const { apiContext, token} = await createAuthorizedApiContext(playwright,process.env.LOGIN_EMAIL,process.env.LOGIN_PASSWORD)
    await injectTokenBeforeNavigation(page,token)
   // const {eventId,title,category,city,price,availableSeats }= await selectBookableEvent(apiContext, 2)
    await page.goto('/bookings')
    const {id,title,category,city,price,availableSeats }= await selectBookableEvent(apiContext, 2)
    const eventId = id
    const payLoad = {eventId, customerName, customerEmail, customerPhone,quantity}
    await expect(page.getByRole('heading',{name:'My Bookings'})).toBeVisible()
    const  {success, bookId, bookingRef} = await createBooking(apiContext, payLoad,token)
    console.log('return value:', success, bookId, bookingRef)
   await page.goto('/bookings')
   const matchedSinglecard =  await findBookingCardByRef(page,bookingRef)
   const bookingID = await matchedSinglecard.locator('#booking-id').textContent()
   await expect (bookingID ).toContain(bookId.toString())
   const bookingRefID = await matchedSinglecard.locator('.booking-ref').first().textContent()
   await expect(bookingRefID).toBe(bookingRef)
   const pageTitle = await page.getByRole('heading').first().textContent()
   const tileTitle = await matchedSinglecard.getByRole('heading').textContent()
   await expect(pageTitle).toContain(tileTitle)  
   await expect(page.getByRole('heading')).toContainText(matchedSinglecard.getByRole('heading'))   //Locate the booking card using findBookingCardByRef(page, bookingRef)
  
   await expect(matchedSinglecard.match(/\d+/)[0]).toBe(2)            //Expected: The card heading equals the runtime-selected event title
   await expect(matchedSinglecard.locator(".text-xl.font-bold.text-indigo-700").textContent()).toHaveText   //Expected: The card shows 2 tickets and the expected total amount
   

})