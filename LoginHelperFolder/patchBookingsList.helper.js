const { expect, request } = require("@playwright/test");
const mutateBooking = 
{
    "success": true,
    "data": {
        "id": 48255,
        "eventId": 1,
        "userId": 3965,
        "customerName": "Amanda Labbe",
        "customerEmail": "testrahul@gmail.com",
        "customerPhone": "14052281080",
        "quantity": 4,
        "totalPrice": "6000",
        "status": "confirmed",
        "bookingRef": "Z-G4XEUK",
        "createdAt": "2026-06-01T22:25:52.088Z",
        "updatedAt": "2026-06-01T22:25:52.088Z",
        "event": {
            "id": 1,
            "title": "India Tech Summit",
            "description": "A premier technology conference bringing together 500+ industry leaders, startup founders, and engineers for two days of keynotes, workshops, and networking. Topics include AI/ML, cloud infrastructure, DevSecOps, and the future of the Indian tech ecosystem.",
            "category": "Conference",
            "venue": "Hyderabad, Hitech city",
            "city": "Hyderabad",
            "eventDate": "2026-04-18T09:00:00.000Z",
            "price": "1500",
            "totalSeats": 500,
            "availableSeats": 8,
            "imageUrl": "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800",
            "isStatic": true,
            "userId": null,
            "createdAt": "2026-02-22T23:03:37.659Z",
            "updatedAt": "2026-05-23T06:57:02.677Z"
        }
      }}


async function patchBookingsList(page, mutateBooking) {
  let patchedBooking = null;
  await page.route("**/api/bookings?page=1&limit=10", async route => {
    console.log('BOOKINGS LIST ROUTE INTERCEPTED');
    //Fetch live response
    const response = await route.fetch();
    const responseBody = await response.json();
    console.log('Original data:', responseBody.data);

//Find correct booking index
    const bookingIndex = responseBody.data.findIndex(
      booking => booking.id === mutateBooking.id
    );
    console.log('Found booking at index:', bookingIndex);
    if (bookingIndex !== -1) {
        console.log('Before patch:', responseBody.data[bookingIndex]);
      Object.assign(responseBody.data[bookingIndex], mutateBooking);
      console.log('After patch:', responseBody.data[bookingIndex]);
    } else {
      console.warn(`Booking with id ${mutateBooking.id} not found — no patch applied`);
    }
    console.log('mutateBooking:', mutateBooking);
    // Fulfill with modified list
    await route.fulfill({
      status: response.status(),
      body: JSON.stringify(responseBody),
      contentType: "application/json",
    });
  });
  return mutateBooking;
  //Return the mutateBooking so test can use it as getPatchedState
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
