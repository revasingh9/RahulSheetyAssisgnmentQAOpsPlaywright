const{expect} = require('@playwright/test')


async function getEventCards(page){
 const cards = page.locator('[data-testid="event-card"]').filter({ visible: true })
  return cards;
}
module.exports = {getEventCards}
