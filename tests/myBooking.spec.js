const { test,expect } = require('@playwright/test')
const { loginUserNamePassword } = require('../LoginHelperFolder/loginUserNamePassword.helper')
const { patchBookingsList,mutateBooking } = require('../LoginHelperFolder/patchBookingsList.helper')

test('Sign in and open My Bookings with one patched list record',async({page})=>{
     await page.goto('/')
   await loginUserNamePassword(page,process.env.LOGIN_EMAIL, process.env.LOGIN_PASSWORD)
    await page.getByRole('link',{ name: /my bookings/i }).first().click();
    await patchBookingsList(page, mutateBooking);
     await page.goto('/')
 //   await loginUserNamePassword(page,process.env.LOGIN_EMAIL, process.env.LOGIN_PASSWORD)
    await page.getByRole('link',{ name: /my bookings/i }).first().click();
    await expect(page.getByText(mutateBooking.title)).toBeVisible();


})