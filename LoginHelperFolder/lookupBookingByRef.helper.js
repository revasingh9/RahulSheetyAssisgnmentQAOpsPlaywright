const{expect} = require('@playwright/test')
const Create_API_Booking_Output = path.resolve(
  process.cwd(),
  "Data",
  "APIBookingOutput.json",
);
tes

async function lookupBookingByRef(apiContext, bookingRef){
    const saved1 = JSON.parse(fs.readFileSync(Create_API_Booking_Output, "utf-8"), );
       // const getEventResponse = await apiContext.get('https://api.eventhub.rahulshettyacademy.com/api/events?page=1&limit=12')
     const lookupBookingRefResponse = await apiContext.fetch('https://api.eventhub.rahulshettyacademy.com/api/bookings/`${bookingRef}`')
    const lookupBookingByRef = await lookupBookingRefResponse.json()
    const {booking_id,reference_code,totalPrice} = lookupBookingByRef
    await expect(lookupBookingByRef[0]).toBeTruthy()//Expected: The lookup response is successful
    await expect(saved1.bookingRef).toContain(bookingRef)//Expected: The returned booking id matches the id from the create response
    await expect(bookingRef).toEqual(lookupBookingByRef[0]) //Expected: The returned reference code matches exactly
    await expect(saved1).toEqual(bookingRef) //Expected: The returned ticket quantity and total amount match the quantity and computed total from Step 1
 
}