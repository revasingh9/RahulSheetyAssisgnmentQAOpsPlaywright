const{test,expect} = require ('@playwright/test')
const packageJson =require('../package.json')
const fs = require('fs')



test('Assert Package.json exists', () => {


    const fileExists = fs.existsSync('package.json');
    expect(fileExists).toBeTruthy()
})


test("Validate Package name",() => {
    expect(packageJson.name).toBeDefined();
})

test('Validate Playwright dependency', () => {

   expect(packageJson.devDependencies['@playwright/test']).toBeDefined();

});

