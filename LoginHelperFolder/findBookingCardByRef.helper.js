const { expect } = require("@playwright/test");

async function findBookingCardByRef(page, bookingRef) {
  
  const bookingcard = await page.locator("#booking-card");
  await bookingcard.first().waitFor({ state: "visible" });

  const getBookingCardCount = await bookingcard.count();

  for (let i = 0; i < getBookingCardCount; i++) {
    const singleCard = bookingcard.nth(i);
    const refText = await singleCard.locator(".booking-ref").textContent();
    if (!refText) continue;
    
    if (refText.trim() === bookingRef.trim()) {
      console.log(`Found card at index ${i} for ref: ${bookingRef}`);
      return singleCard; //return the whole card locator
    }
  }
     return null;
}

module.exports = { findBookingCardByRef }
