const { test,expect } = require('@playwright/test');
const config = require('../playwright.config')



test('Validate Playwright Config',async () => {

    console.log(config)
    await expect(config.use.baseURL).toBeDefined();
})


test('Validate Browser Projects', () => {
const projectNames = config.projects?.map(project => project.name)
 expect(projectNames).toContain('chromium')
 expect(projectNames).toContain('firefox')

})