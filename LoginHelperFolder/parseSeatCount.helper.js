const{expect} = require('@playwright/test')


async function parseSeatCount(text){
  
 const seatCount = parseInt(text.split(' ')[0])
 console.log('Parsed seat count:', seatCount)
 return seatCount

}
module.exports = {parseSeatCount}