import { expect, type Locator, type Page } from '@playwright/test';


export class EventsPage {

  readonly page: Page;
  readonly eventCards: Locator;
  readonly searchInput: Locator;

  constructor(page: Page) {
    this.page = page;
    this.eventCards = page.locator('[data-testid="event-card"]');
    this.searchInput = page.getByPlaceholder('Search events, venues…');
  }
 
   async navigate() {
    await this.page.goto('https://eventhub.rahulshettyacademy.com/events');
  }
 
  async searchFor(keyword: string) {
    await this.searchInput.fill(keyword);
  }
 
  async getCardCount() {
    return await this.eventCards.count();
  }
 
  async getFirstCardTitle() {
    return await this.eventCards
      .first()
      .getByRole('heading')
      .innerText();
  }
}
 
