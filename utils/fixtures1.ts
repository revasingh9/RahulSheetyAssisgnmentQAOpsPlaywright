import{test as base, type  Page} from '@playwright/test'

import { request } from '@playwright/test';
import { EventCreationThroughAPI } from '../utils/EventCreationThroughAPI'

const  loginPayLoad = {email: "revasingh9@yahoo.in", password: "Mall##ika30"};

const eventPayload = {
    title: "NewEvent",
    description: "Creating Event through Post API and Playwright",
    category: "Festival",
    city: "Hyderabad",
    eventDate: "2026-09-29T03:00:00.000Z",
    price:500,
    totalSeats: 200,
    venue: "Novotel Hotel Rd, Izzathnagar, Shilpa Hills, Kothaguda, Hyderabad, Telangana 500084, India"
};


 export type MyFixtures = {
    authenticatedPage : Page
    createEvent : {token : string; eventID : number; eventTitle : string} 
    };




export const customtest = base.extend<MyFixtures>({


    authenticatedPage : async({browser},use)=> {

    const context = await browser.newContext()
    const page = await  context.newPage()
    await page.goto('/')
    await page.getByPlaceholder('you@email.com').fill(process.env.LOGIN_EMAIL!)
    await page.getByRole('textbox', { name: 'Password' }).fill(process.env.LOGIN_PASSWORD!)
    await page.getByRole('button', { name: 'Sign In' }).click()
    await use(page)
    },

    createEvent : async({},use) => 
    {
        const apiContext = await request.newContext()
        const eventCreationThroughAPI = new EventCreationThroughAPI(apiContext,loginPayLoad )
        const responseData = await eventCreationThroughAPI.eventCreation(eventPayload)
        await use(responseData)

    }

})



