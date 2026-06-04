const { expect, request } = require("@playwright/test");
const mutateBooking = {
  "bookingRef": "OKC-O2z7IB",
  "title": "Testing live",
  "totalPrice": "999",
  "quantity": "10"
};
async function patchBookingsList(page, mutateBooking) {
  let patchedBooking = null;
  let routeTriggered = false;
  
  const routePromise = new Promise((resolve) => {
    page.route("**/api/bookings**", async (route) => {
      const url = route.request().url();
      // Only intercept the bookings list endpoint
      if (url.includes("page=1&limit=10")) {
        console.log("BOOKINGS LIST ROUTE INTERCEPTED");
        //Fetch live response
        const response = await route.fetch();
        const responseBody = await response.json();
        console.log("Original data:", responseBody.data);

        // Patch the first record (index 0) — apply to both booking & its nested event
        if (responseBody.data && responseBody.data.length > 0) {
          const firstBooking = responseBody.data[0];
          console.log('Before patch:', firstBooking);
          console.log('Booking ID before patch:', firstBooking.id);
          Object.assign(firstBooking, mutateBooking);       // top-level fields like totalPrice
          Object.assign(firstBooking.event, mutateBooking); // nested fields like title
          patchedBooking = firstBooking;
          console.log('After patch:', firstBooking);
          console.log('Patched Booking ID:', patchedBooking.id);
          console.log('mutateBooking:', mutateBooking);
          routeTriggered = true;
          resolve(patchedBooking);
        }
        
        // Fulfill with modified list
        await route.fulfill({
          status: response.status(),
          body: JSON.stringify(responseBody),
          contentType: "application/json",
        });
      } else {
        route.continue();
      }
    });
  });
  
  // Wait a bit for the route to be set up, but don't block indefinitely
  const timeoutPromise = new Promise(resolve => setTimeout(() => resolve(null), 500));
  
  return {
    mutateBooking,
    patchedBooking: null, // Will be populated after route triggers
    routePromise // Return the promise so test can await it if needed
  };
}

// async function patchBookingsList(page, mutateBooking) {
//   await page.route("**/api/bookings?page=1&limit=10", async route => {
//     console.log('ROUTE INTERCEPTED');
//     const response = await route.fetch();
//     const responseBody = await response.json();
//     console.log(responseBody.data);
//     const patchedBookings =  responseBody.data.find(booking => booking.id === mutateBooking.id);

//        if (patchedBookings){
//            Object.assign(responseBody.data[0], mutateBooking);
//        }
// console.log('response--',responseBody.data[0])
// console.log(mutateBooking)

//     await route.fulfill({

//       status: response.status(),
//       body :JSON.stringify(responseBody),
//       contentType: "application/json",

//     });
// })
// }

module.exports = { patchBookingsList, mutateBooking };
