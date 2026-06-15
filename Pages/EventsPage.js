class EventsPage {
  constructor(page) {
    this.page = page;
    this.eventCards = page.locator('[data-testid="event-card"]');
    this.searchInput = page.getByPlaceholder('Search events...');
  }
 
  async navigate() {
    await this.page.goto('https://eventhub.rahulshettyacademy.com/events');
  }
 
  async searchFor(keyword) {
    await this.searchInput.fill(keyword);
  }
 
  async getCardCount() {
    return await this.eventCards.count();
  }
 
  async getFirstCardTitle() {
    return await this.eventCards
      .first()
      .locator('[data-testid="event-title"]')
      .innerText();
  }
}
 
module.exports = { EventsPage };