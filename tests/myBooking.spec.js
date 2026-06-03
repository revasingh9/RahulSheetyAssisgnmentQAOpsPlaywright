const { test,expect } = require('@playwright/test')
const { loginUserNamePassword } = require('../LoginHelperFolder/loginUserNamePassword.helper')
const { patchBookingsList,mutateBooking } = require('../LoginHelperFolder/patchBookingsList.helper')
const { patchBookingDetail } = require('../LoginHelperFolder/patchBookingsDetail.helper')

test('Sign in and open My Bookings with one patched list record',async({page})=>{
    const getPatchedState = await patchBookingsList(page, mutateBooking);
     console.log('Stored patched booking for assertions:', getPatchedState);
  console.log('Selected booking id:', getPatchedState.data.id);
  console.log('Selected booking ref:', getPatchedState.data.bookingRef);
  console.log('Selected customer name:', getPatchedState.data.customerName);
  console.log('Selected status:', getPatchedState.data.status);
  console.log('Selected total price:', getPatchedState.data.totalPrice);
  await  patchBookingDetail(page,getPatchedState)
     await page.goto('/')
   await loginUserNamePassword(page,process.env.LOGIN_EMAIL, process.env.LOGIN_PASSWORD)
    
    await page.getByRole('link',{ name: /my bookings/i }).first().click();
    
 //    await page.goto('/')

 //   await page.getByRole('link',{ name: /my bookings/i }).first().click();
    //await expect(page.getByText(mutateBooking.title)).toBeVisible();


})