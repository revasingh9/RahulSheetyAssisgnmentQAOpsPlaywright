const{expect} = require('@playwright/test')
const fs = require("fs");
const path = require("path");
const OriginalCustomerDetails = path.resolve(  process.cwd(), "Data",  "CustomerDetails.json",
);

async function patchBookingDetail(page, getPatchedState){
  const bookingId = getPatchedState?.id;
  console.log(`Setting up route for: **/api/bookings/${bookingId}`);

  let resolveRoute;
  const routePromise = new Promise((resolve) => {
    resolveRoute = resolve;
  });

  // Set up the route handler synchronously
  page.route(`**/api/bookings/${bookingId}`, async (route) => {
    try {
      console.log('DETAIL ROUTE INTERCEPTED for:', route.request().url());
      const response = await route.fetch();
      const responseBody = await response.json();
      console.log('Original booking detail (full):', JSON.stringify(responseBody, null, 2));
       fs.writeFileSync(
    OriginalCustomerDetails,
    JSON.stringify(responseBody, null, 2),
  );
      
      // Deep copy the response to avoid mutations
      let patchedDetail = JSON.parse(JSON.stringify(responseBody));
  
       Object.assign(patchedDetail.data, {
        title: getPatchedState.title,
        totalPrice: getPatchedState.totalPrice,
        quantity: getPatchedState.quantity,
        bookingRef: getPatchedState.bookingRef
      });
      // Patch values INSIDE the data object (API wraps response in data)
      // if (patchedDetail.data) {
      //   if (getPatchedState.title) patchedDetail.data.title = getPatchedState.title;
      //   if (getPatchedState.totalPrice) patchedDetail.data.totalPrice = getPatchedState.totalPrice;
      //   if (getPatchedState.quantity) patchedDetail.data.quantity = getPatchedState.quantity;
      //   if (getPatchedState.bookingRef) patchedDetail.data.bookingRef = getPatchedState.bookingRef;
        
        // Patch nested event title
        if (getPatchedState.event && patchedDetail.data.event) {
          if (getPatchedState.event.title) patchedDetail.data.event.title = getPatchedState.event.title;
        }
      
      
      console.log('Patched detail response:', JSON.stringify(patchedDetail, null, 2));
   
      await route.fulfill({
        status: response.status(),
        body: JSON.stringify(patchedDetail),
        contentType: 'application/json',
      });
      
      resolveRoute(patchedDetail);
    }
     catch (error) {
      console.error('Route handler error:', error);
      route.continue();
      }
  })  
  return routePromise;
};
module.exports = { patchBookingDetail }