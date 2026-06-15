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

export class LoginPage {
  private readonly page:Page;
  public readonly emailInput: Locator;
  public readonly passwordInput: Locator;
  public readonly loginButton: Locator;

  constructor(page:Page)
{
   this.page = page;
   this.emailInput = page.getByPlaceholder('you@email.com')
   this.passwordInput= page.getByLabel('Password')
   this.loginButton = page.getByRole('button', { name: 'Sign In' })
}
  async navigate(): Promise<void> {
    await this.page.goto('https://example.com/login');
  }
}


tests file 
import { test } from '@playwright/test';
import { LoginPage } from './LoginPage';
test('User can navigate to login page', async ({ page }) => {
const loginPage = new LoginPage(page);
await loginPage.navigate();
})

Q1. You have a large Playwright automation project written in JavaScript. Your team lead asks you to migrate it to TypeScript. List three concrete benefits this migration brings specifically to a Playwright automation project — not just generic TypeScript benefits, but ones that directly improve how you write, maintain, or debug tests.

Ans.1. Typescript has static typing System which check error during the devlopment.Robust IntelliSense, and safe refactoring
2. TypeScript catches misspelled configuration parameters or missing test data properties right in the editor before you waste time running the test suite. 
Example :- If you make a typo in your configuration (like writing baseUrl instead of baseURL), JavaScript won't say a word while you are typing. But in typescript it will give you red squigally red line
3.TypeScript configurations (like the strict rules we set up in your tsconfig.json) can actively flag un-awaited expressions, saving you hours of debugging flaky tests. 
 This mean if you forget the await keyword in JavaScript, it will silently pass or fail unpredictably. But in typescript it won't.

 Q2. Look at the two TypeScript snippets below. Both are valid but behave differently. Explain the difference between them and describe a real scenario in Playwright automation where you would choose one over the other.
 // Snippet A
let seatCount: number | null = null;
Null is non empty object which will not return 0 i.e it is Unknown Data or not intialize in the begigning. Real scenario where it is used - API Testing  or Conditional UI States
 
// Snippet B
let seatCount: number = 0;
In this snippet seatCount is number variable which has value 0 , so if we assign some value to number it will have that value, real scenario where it is used is for counting and counter looping or Expected UI Quantities.

Q3. A teammate writes the following TypeScript interface for a booking form and asks for your review. Identify at least two problems with it and rewrite the corrected version.
  wrong code version 

  interface BookingForm {
  fullName: String;
  email: string;
  phone: Number;
  ticketCount: string;
}

right code version 
export interface BookingForm {  // Added export at the beginning
    fullName: string;           // converted capital 'S' to lower case 's'  
    email: string;
     phone: number;               // // converted capital 'N' to lower case 'n'  
      ticketCount: number;         // changed variable type of ticketCount to number from string 
       }
  