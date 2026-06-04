

async function parseCurrency(text){

const numericPrice = parseInt(text.replace('$', '').replace(',', '').trim());
console.log('Parsed price:', numericPrice)
return numericPrice
}

module.exports = {  parseCurrency }