const{expect} = require('@playwright/test')

async function parseTicketCount(text){
const ticketCount = parseInt(text.match(/\d+/)[0]);
console.log('Ticket count:', ticketCount);  

return ticketCount

}

module.exports = { parseTicketCount }