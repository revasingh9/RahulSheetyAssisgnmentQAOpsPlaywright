const { expect } = require("@playwright/test");

async function lookupBookingByRef(apiContext, bookingRef, token) {
  try {
    // Lookup booking by reference using the API
        console.log(`https://api.eventhub.rahulshettyacademy.com/api/bookings/${bookingRef}`)
  const lookupResponse = await apiContext.fetch(
  `https://api.eventhub.rahulshettyacademy.com/api/bookings/${bookingRef}`,
  {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
);

    // Verify the response is successful
   

    const lookupData = await lookupResponse.json();
     console.log("Booking lookup response:", lookupData);
    console.log("Booking lookup response:", lookupData);

    // Extract booking details
    const { id, bookingRef: returnedRef, quantity, totalPrice } = lookupData;
    const booking = lookupData.data || lookupData; // Handle cases where data is nested

    return lookupData
  
  } catch (error) {
    throw new Error(`Failed to lookup booking by ref "${bookingRef}": ${error.message}`);
  }
}

module.exports = { lookupBookingByRef };