const{test,expect} = require('@playwright/test')
const{openLoginPage} = require('../LoginHelperFolder/openLoginpage.helper')

test('EventHub login page loads', async({page})=>{        //In this line of code -Playwright actions return promises 
   
    await page.goto('/login');  
     //Playwright actions (click, fill, goto) return Promises — await ensures each action completes before the next one runs, preventing timing issues and flaky behavior
    await expect(page.getByPlaceholder('you@email.com')).toBeVisible()
    await expect (page.getByRole('button',{name:'Sign In'}))
})

test.only('Create a second test in the same file',async({page})=>{
 await page.goto('/')
 await expect(page.getByLabel('password')).toBeVisible()
 await expect(page).toHaveURL('https://eventhub.rahulshettyacademy.com/login');
 await expect(page.url()).toEqual('https://eventhub.rahulshettyacademy.com/login')
 await expect(page.getByRole('heading',{name:'Sign in to EventHub'})).toBeVisible()


})