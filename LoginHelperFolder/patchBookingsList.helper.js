const { expect, request } = require("@playwright/test");
const mutateBooking = {
    id: 45029,
title: 'Tech Conference 2026',
customerName: 'Ruhi Kumari',
  category: 'Conference',
  city: 'Hyderabad',
  date: '2026-08-15',
  price: 1500,
  totalSeats: 150,
  availableSeats: 150
};

async function patchBookingsList(page, mutateBooking) {
  await page.route("**/api/bookings?page=1&limit=10", async route => {
    console.log('ROUTE INTERCEPTED');
    const response = await route.fetch();
    const responseBody = await response.json();
    console.log('Original data:', responseBody.data);
    const bookingIndex = responseBody.data.findIndex(
      booking => booking.id === mutateBooking.id
    );
    console.log('Found booking at index:', bookingIndex);
    if (bookingIndex !== -1) {
        console.log('Patched bookin Pre', responseBody.data[bookingIndex]);
      Object.assign(responseBody.data[bookingIndex], mutateBooking);
      console.log('Patched booking:', responseBody.data[bookingIndex]);
    } else {
      console.warn(`Booking with id ${mutateBooking.id} not found — no patch applied`);
    }

    console.log('mutateBooking:', mutateBooking);
    await route.fulfill({
      status: response.status(),
      body: JSON.stringify(responseBody),
      contentType: "application/json",
    });
  });
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
