const{expect} = require('@playwright/test')
//const payLoad = {customerName, customerEmail, customerPhone,quantity}
const fs = require("fs");
const path = require("path");
const Create_API_Booking_Output = path.resolve(  process.cwd(), "Data",  "APIBookingOutput.json",
);

async function createBooking(apiContext, payLoad,token){
        const bookResponse = await  apiContext.post('https://api.eventhub.rahulshettyacademy.com/api/bookings',
            {
                data : payLoad,
                headers:{

                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'

                }
                

            }
        )

const bookResponseJson = await bookResponse.json()
console.log('Book Response  Json:',bookResponseJson)
const bookID = bookResponseJson.id || bookResponseJson.data?.id
console.log('Booking ID:', bookID)
await expect(bookResponse.ok()).toBeTruthy()
 fs.writeFileSync(
    Create_API_Booking_Output,
    JSON.stringify(bookResponseJson, null, 2),
  );
  const {success,   data: { id, bookingRef } } = bookResponseJson

return {
  success,
  bookId: id,
  bookingRef
};
}


module.exports = {createBooking}