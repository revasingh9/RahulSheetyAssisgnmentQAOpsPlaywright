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


 //Javascript-Typescript-OOP-Concepts/Assign-2-Encapsulation-And-Access-Modifiers      

 Q2. Explain Encapsulation and why it matters in a Page Object
 Ans. Encapsulation in JavaScript is the practice of bundling data (properties) and the methods that act on that data into a single unit (like an object or class) while restricting direct access to some of the object's internal components. It acts as a protective shield that prevents outside code from accidentally modifying or misusing an object's internal state
      

      OR
Encapsulation is the packing of data and functions into one component (for example, a class) and then controlling access to that component to make a "blackbox" out of the object. Because of this, a user of that class only needs to know its interface (that is, the data and functions exposed outside the class), not the hidden implementation.
It's importance:-
 Data Protection: It shields internal states from unauthorized external changes, preventing logic corruption.
 Controlled Modification: You can use validation logic inside methods before updating any values.
 Code Maintainability: Changing internal class code will not break external application logic.
 Cleaner Interfaces: It hides messy implementation details and exposes a simple public API

 Access Modifiers:-

public: Accessible from anywhere (default).
private: Accessible only within the class it is defined.
protected: Accessible within the class and any subclasses (children) that inherit from it.

import { Page, Locator } from '@playwright/test';
 
export class CheckoutPage {
  public page: Page;   // Instead of public it should be 'Private readonly', so that not anybody can modified the page
  public submitButton: Locator; // Instead of public it should be 'Private readonly', so that not anybody can modified the locator
  public totalPrice: Locator; // Instead of public it should be 'Private ', so that not anybody can modified the locator
 
  constructor(page: Page) {
    this.page = page;
    this.submitButton = page.locator('#submit-order');
    this.totalPrice = page.locator('.total-price');
  }
 
  async submitOrder(): Promise<void> {
    await this.submitButton.click();
  }
 
  async getTotalPrice(): Promise<string> {
    return await this.totalPrice.innerText();
  }
}

By making the locators private, you protect your entire test suite from future maintenance. This creates a huge advantage called Maintainability and honors the DRY (Don't Repeat Yourself) principle.
Difference between 'private'/'public' and 'private readonly'/'public readonly'

private/public :- Used when the value of the property will change over time while running test or application.
'private readonly'/'public readonly' :-Used when the property is set inside the constructor and should never be overwritten or changed for the entire lifecycle of that object.

3-Inheritance-and-Extends

What is Inheritance and when would you use it in a Playwright project?

Inheritance means inhertining the base/parent class properties and extending/or adding the more properties to child class using the extends
keywords. This allows the child class to reuse existing code while extending it with new.

You use it when you have common components, actions, or properties shared across multiple pages.
The Base Page (Parent Class): You create a BasePage class that holds common elements (like a navigation bar, header, or footer) and common methods (like MapsTo(), waitForPageLoad()).
The Specific Pages (Child Classes): Pages like LoginPage, DashboardPage will extend the BasePage. They automatically get access to the common navigation methods without rewriting them, allowing them to focus only on their unique locators.

import { Page, Locator } from '@playwright/test';
export class BaseEventsPage  {
  protected readonly page:Page
  private readonly eventCards:Locator

  constructor(page: Page) {
    this.page = page;
     this.eventCards = page.locator('[data-testid="event-card"]');
  }

  async navigate(): Promise<void>{
  await this.page.goto('https://eventhub.rahulshettyacademy.com/events')
  }

 async waitForCards(): Promise<void>{
  await this.eventCards.first().waitFor({state:'attached"})
 }
 async getCardCount(): Promise<number>{
  return await this.eventCards.count();
 }
}
import(BaseEventsPage) from'./BaseEventsPage'
export class AdminEventsPage extends BaseEventsPage{
  constructor(page: Page){
    super(page)
  }
}

export class UserEventsPage extends BaseEventsPage{
  constructor(page: Page){
    super(page)
  }

}

//I don't understand what I have to do for this question and I don't understand  composition also, I tried google, still it is not that clear.

Bonus: you discuss when inheritance is the right choice vs composition — inheritance suits "is-a" relationships (AdminEventsPage IS an EventsPage), while composition suits "has-a" relationships


//Assignment-Protected-vs-Private

What is the difference between protected and private in TypeScript?
Both private and protected allow properties to be changed inside the same class.
Difference :-
private:- the property can only be accessed inside the exact class where it was created. Even child classes that inherit from it cannot see or change it.
protected:- the property can be accessed inside the class where it was created AND any child classes(subclasses) that extend it.
  
  class basePage{
    protected page: Page;   //Child classes CAN use this
    userName : string;  
    private secretKey = string; // ONLY BasePage can use this

     constructor(page: Page){
      this.page = page;
      this.userName = 'testuser@gmail.com';
      this.secretkey ='abc123'
     }
  }

  class loginpage extends basePage{
    async login(){
      // 1. This works perfectly because 'page' is protected!
      await this.page.fill('#username', 'user')
      console.log(this.secretKey); //'secretKey' is private and only accessible within class 'BasePage'
    }
  }
Question:  In the BaseEventsPage class from Q3, the page property is marked protected. If you changed it to private, what would break and why?

Answer : If I change the page property from protected to private , page property will not be accessed in child class and it will give error.
AdminEventsPage and UserEventsPage only call super(page) inside their constructors,so the code will work without any error . However, it will break the moment we try to add child-specific methods that interact with the browser window.


"In a scalable Page Object Model architecture, the browser page instance and any globally shared elements  inside a Base Page Object should almost always be marked as protected, not private. Because Child Page Objects are created specifically to build upon the base layer. If we lock these core properties down as private, we defeat the purpose of inheritance. Every time a child page needs to perform an action unique to its page (such as taking a screenshot, waiting for a custom network event, or interacting with a shared header element), it will be blocked by TypeScript.
By using protected, we maintain clean encapsulation—keeping the outside test files from messing with our internal elements—while ensuring our child pages have the necessary access to extend and scale the automation framework seamlessly."


Assignment-5-Abstraction-and-Interfaces

Q5. What is Abstraction and how can it be applied to a Playwright utility?

Ans. Abstraction is the OOP principle of exposing only essential behavior while hiding implementation details. It uses methods/interfaces/utilities.

example of abstraction
import { Page } from '@playwright/test';

export class LoginPage {

  protected page: Page;   //Child classes CAN use this
  protected userName : string;  
  protected password: string
  constructor(page: Page) {
    this.page = page;
  }

  async login(email: string, password: string): Promise<void> {
    await this.page.goto('/login');
    await this.page.getByPlaceholder('you@email.com').fill(email);
    await this.page.getByLabel('Password').fill(password);
    await this.page.getByRole('button', { name: 'Sign In' }).click();
  }
}

Now the test becomes:
const loginPage = new LoginPage(page);

await loginPage.login(
  process.env.LOGIN_EMAIL!,
  process.env.LOGIN_PASSWORD!
);

Another Example :- Created utility 
export function parseCurrency(value: string): number {
  return parseFloat(
    value.replace('$', '').replace(',', '').trim()
  );
}

Usage: const price = parseCurrency(priceText);

interface Notification{
  verifyMessage(text:string): Promise<void>
  verifyHiddden(): Promise<void>

  
}

class  ToastNotification implements Notification{
  consturctor(private page: page){}

   async verifyMessage(text:string): Promise<void>{
    await expect(this.page.locator('.toast-message'))..toHaveText(text);
   }

   async  verifyHiddden(): Promise<void> {
    await expect(this.page.locator('.toast-message'))
      .toBeHidden()

   }
}

class  BannerNotification implements Notification{
  consturctor(private page: page){}

   async verifyMessage(text:string): Promise<void>{
    await expect(this.page.locator('.inline-banner'))..toHaveText(text);
   }

   async  verifyHiddden(): Promise<void> {
    await expect(this.page.locator('.inline-banner'))
      .toBeHidden()

   }
}