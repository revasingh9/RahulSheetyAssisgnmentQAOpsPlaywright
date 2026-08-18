import {expect} from '@playwright/test'
import {customtest } from '../utils/fixtures1'


customtest('Event Login',async({authenticatedPage,createEvent})=>{

    
    const headerTitle = authenticatedPage.locator('.text-lg.font-bold.text-gray-900.tracking-tight')
    const headerTitleText = await headerTitle.textContent()
    console.log('Header Title:', headerTitleText)
    expect (headerTitleText).toEqual('EventHub')
  const  assertedBrowseEventLink = authenticatedPage.getByRole('link',{ name :'Browse Events →'})
  await expect (assertedBrowseEventLink).toBeVisible()
   // await authenticatedPage.reload();
  //await assertedBrowseEventLink.click()
  await authenticatedPage.getByRole('button',{name : "Admin"}).click()
  await authenticatedPage.getByRole('link',{name : 'Manage Events'}).first().click()

 
const tableRowByEventTitle = authenticatedPage.getByTestId('event-table-row').filter({ hasText : createEvent.eventTitle })
await expect(tableRowByEventTitle).toBeVisible()
const eventTitleCell = tableRowByEventTitle.getByRole('cell').first()
await expect(eventTitleCell).toHaveText(createEvent.eventTitle)





})