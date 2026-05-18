const{test,expect} = require('@playwright/test')
const{ReusableLoginPage} = require('../loginHelper/ReusableLoginPage')

test('LoginPage', async({page})=>{        //In this line of code -Playwright actions return promises 
    const username ='revasingh9@yahoo.in';
    const password ="Mall##ika30"


    const loginPage = new ReusableLoginPage(page);
    await loginPage.goTo();
    await loginPage.validLogin(username,password); //And here Await prevents timing issues and flaky behavior
  
   await expect(page.getByRole('link', { name: 'EventHub' })).toBeVisible();
})