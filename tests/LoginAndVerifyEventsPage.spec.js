const{test,expect} = require('@playwright/test')
const{login,getEventTitles} = require('../LoginHelperFolder/login.helper')

test('Verify Events',async({page})=>{

await login(page,"revasingh9@yahoo.in","Mall##ika30");
const titles = await getEventTitles(page);
console.log(titles);
expect(titles.length).toBeGreaterThan(0);


})