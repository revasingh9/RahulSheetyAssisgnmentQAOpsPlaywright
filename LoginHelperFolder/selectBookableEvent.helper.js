const{expect} = require('@playwright/test')
 
async function selectBookableEvent(apiContext, minimumSeats){
     const getEventResponse = await apiContext.get('https://api.eventhub.rahulshettyacademy.com/api/events')
    const eventResponseData = await getEventResponse.json()
     console.log('Total events fetched:', eventResponseData)
     const bookableEvents = eventResponseData.data.filter(event => event.availableSeats >= minimumSeats)
      console.log(`Events with at least ${minimumSeats} seats:`, bookableEvents.length);
      console.log('Events list:', bookableEvents);
     const selectedEvent = bookableEvents[0];
     console.log('Selected Events list:', bookableEvents[0]);
     const{id,title,category,city,price,availableSeats} = selectedEvent

     return {id,title,category,city,price,availableSeats }

     
}
module.exports = { selectBookableEvent }