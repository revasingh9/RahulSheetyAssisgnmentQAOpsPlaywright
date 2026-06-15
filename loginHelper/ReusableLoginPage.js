const{expect}  = require('@playwright/test')


class ReusableLoginPage {


    constructor(page) {
        this.page = page;
        this.userName = page.getByPlaceholder('you@email.com')
        this.password = page.getByRole('textbox', { name: 'Password' })
        this.signInButton = page.getByRole('button', { name: 'Sign In' })

    }
    async goTo() {
        await this.page.goto('/')
    }
    async validLogin(username, password) {
        await this.userName.fill(username);
        await expect (this.userName).toBeVisible();

        await this.password.fill(password);
        await expect(this.password).toBeVisible()
          await expect (this.signInButton).toBeVisible()
        await this.signInButton.click();
        await expect (this.page).toHaveURL(/login/)
      
    
        await this.page.waitForLoadState('networkidle')
    }
   
}
module.exports={ReusableLoginPage}





