const{test,expect} = require('@playwright/test')
const{login,getEventTitles} = require('../LoginHelperFolder/login.helper')

test('Verify Events',async({page})=>{

await login(page,process.env.LOGIN_EMAIL,process.env.LOGIN_PASSWORD);
const titles = await getEventTitles(page);
console.log(titles);
expect(titles.length).toBeGreaterThan(0);


})