const{expect, request} = require('@playwright/test')
const mockEvents= [{

    id: 101,
    title: "Tech Conference 2026",
    category: "Conference",
    city: "Hyderabad",
    date: "2026-08-15",
    price: 1500,
    totalSeats:50,
    availableSeats: 50,
},
{  id: 102,
   title: "Delhi Food Festival",
   category: "Festival",
   city: "Delhi",
   date: "2026-09-10",
   price: 500,
   totalSeats:100,
   availableSeats: 100,
},
{
    id: 103,
   title: "Mumbai Music Concert",
   category: "Concert",
   city: "Mumbai",
    date: "2026-10-05",
    price: 2000,
    totalSeats:200,
   availableSeats: 200,
},
{
    id: 104,
    title: "Playwright Workshop",
    category: "Workshop",
    city: "Bangalore",
    date: "2026-11-20",
    price: 3000,
    totalSeats:800,
    availableSeats:800,
}
]


async function installMockEventRoutes(page, mockEvents) {
  await page.route('**/api/events?page=1&limit=12', async route => {
    //intercepting response - API response -> ||||(intercepting the data as fake data and that fake data sending to browser ) browser->render data on frontend
 //    const response = await  page.request.fetch(route.request())
      const  body = JSON.stringify({
        data: mockEvents,       
      pagination: {
        total: mockEvents.length,
        page: 1,
        limit: 12,
        totalPages: 1,
       }
    });
      
await route.fulfill({
      status: 200,           
      body,
      contentType: 'application/json'
    });
   });

    for (const event of mockEvents) {
    await page.route(`**/api/events/${event.id}`, async route => {
      await route.fulfill({
        status: 200,
        body: JSON.stringify(event),
        contentType: 'application/json',
      });
     });
    }
}

async function findEventCardByTitle(page,targetTitle,mockEvents){
  const eventCard = page.locator('[data-testid="event-card"]').filter({hasText: targetTitle})

  const matchedEvent = mockEvents.find(event => event.title === targetTitle);
  if (!matchedEvent) {
    throw new Error(`No mock event found with title: "${targetTitle}"`);
  }
  console.log(`Found mock event:`, matchedEvent);
   return {
    card: eventCard,      
    mockEvent: matchedEvent 
  };

}
module.exports = {installMockEventRoutes,findEventCardByTitle,mockEvents};