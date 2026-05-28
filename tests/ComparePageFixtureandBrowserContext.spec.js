const{test,expect} =require('@playwright/test')
const {openLoginPage} = require('../LoginHelperFolder/OpenLoginpage.helper')

test('EventHub Login Page Load', async({page})=>{  //page fixture:- is single tab or popup window within a browser context where action is performed . It is isolated page
      await page.goto('/');
      await expect(page).toHaveURL("https://eventhub.rahulshettyacademy.com/login")
      await expect(page.getByRole('heading',{name: 'Sign in to EventHub'})).toBeVisible()
      await page.waitForLoadState('networkidle')
      await expect(page.getByPlaceholder('you@email.com')).toBeVisible()
      await expect(page.getByLabel('Password')).toBeVisible()
      await expect(page.getByRole('button', { name: 'Sign In' })).toBeVisible()
})

test("Use the built-in page fixture", async ({ page,browser }) => {
  await page.goto('/')
  const emailTextbox = page.getByRole("textbox", { name: "Email" });
  const enteredUsername = await emailTextbox.fill("beginner@sample.com");
  await expect(emailTextbox).toHaveValue("beginner@sample.com");
});
test('Create a fresh browser context manually', async({browser}) => { // browser = The actual browser application(Chromium,Firefox,Webkit)

    const isolatedContext = await browser.newContext() //context - user profile- An isolated session with private data(cookies/storage)
    const isolatedPage = await isolatedContext.newPage()
    await isolatedPage.goto('https://eventhub.rahulshettyacademy.com/login')
    
    await expect(isolatedPage.getByRole('heading',{name:'Sign in to EventHub'})).toBeVisible();

    await expect(isolatedPage.getByRole('textbox',{name:"Email"})).toHaveValue("")
    await isolatedPage.waitForTimeout(5000)
    await isolatedContext.close()

})



