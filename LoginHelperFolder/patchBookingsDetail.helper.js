const{expect} = require('@playwright/test')

async function patchBookingDetail(page, getPatchedState){
   
    await page.route(`**/api/bookings/${getPatchedState.data.id}`, async route => {     
    //patchBookingDetail(page, getPatchedState) helper that intercepts /api/bookings/{id} for the selected booking id and returns a detail response aligned with the patched list data

    console.log('ROUTE INTERCEPTED');
    const response = await route.fetch();
    const responseBody = await response.json();
     console.log('Original booking detail:', responseBody);
     const patchedDetail = {
      ...responseBody,           // keep all original fields
      ...getPatchedState,        // override with patched values
    };
    console.log('Patched booking detail:', patchedDetail);
     console.log('Aligned detail response:', alignedDetail);
    console.log('Detail booking id:', alignedDetail.id);
    console.log('Detail customer name:', alignedDetail.customerName);
    console.log('Detail status:', alignedDetail.status);
    console.log('Detail total price:', alignedDetail.totalPrice);
    await route.fulfill({
      status: response.status(),
      body: JSON.stringify(patchedDetail),
      contentType: 'application/json',
    });
  });
}



module.exports = { patchBookingDetail }