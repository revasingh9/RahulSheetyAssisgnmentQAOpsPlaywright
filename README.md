Difference between 
playwright package - provide support for only the browser automation.Provides only the core APIs for launching and interacting with browsers.
Automation Focus: Best suited for non-testing tasks like web scraping, PDF generation, or building custom automation tools.
No Runner: It does not include a test runner, so you would have to manually integrate it with other frameworks like Jest, Mocha, or Vitest if you want to run tests.
@playwright/test package- support browser automation, has built in test runner,
Smart Assertions: Provides the expect function with web-first assertions that automatically wait for conditions to be met.
Orchestration: Manages configuration files, reporters (like HTML reports), and the Trace Viewer for debugging
Fixtures: Includes powerful Test Fixtures like page and context that are automatically set up and torn down.

What is a Class and how does it relate to Page Objects in Playwright?
A class is a blue print or reusable template containing properties and methods used to create objects that group related data(properties) and actions(methods)together. In Playwright POM, classes represent application pages and encapsulate locators and page actions to create scalable and maintainable automation frameworks.
reduce duplicate code
improve readability
improve maintainability
centralize UI changes in one place
Real-world Relation to POM

Without classes:
test code becomes repetitive
locators are scattered everywhere
With classes:each page becomes modular
reusable methods improve framework design.That is why POM heavily relies on classes.
LoginPage is the class
locators are properties
login action is a method

import { Page, Locator } from '@playwright/test';

class LoginPage {
  emailInput: Locator;
  passwordInput: Locator;
  loginButton: Locator;

  constructor(page:Page)
{
   this.page = page,
   this.emailInput = page.getByPlaceholder('you@email.com')
   this.passwordInput= page.getByLabel('Password')
   this loginButton = page.getByRole('button', { name: 'Sign In' })
}
  async navigate(): Promise<void> {
    await this.page.goto('https://example.com/login');
  }
}


tests file 
const loginPage = new LoginPage(page);
await loginPage.navigate();

