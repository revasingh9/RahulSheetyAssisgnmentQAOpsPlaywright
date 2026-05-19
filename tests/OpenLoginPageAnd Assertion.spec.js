const{test,expect} =require('@playwright/test')
const {login} = require('../LoginHelperFolder/OpenLoginpage.helper')




test('EventHub Login Page Load', async({page})=>{

;
      await login(page);
      expect(page).toHaveURL("https://eventhub.rahulshettyacademy.com/login")
      expect(page.getByRole('heading',{name: 'Sign in to EventHub'})).toBeVisible()
      await page.waitForLoadState('networkidle')
      expect(page.getByPlaceholder('you@email.com')).toBeVisible()
      await expect(page.getByLabel('Password')).toBeVisible()
       expect(page.getByRole('button', { name: 'Sign In' })).toBeVisible()



})
