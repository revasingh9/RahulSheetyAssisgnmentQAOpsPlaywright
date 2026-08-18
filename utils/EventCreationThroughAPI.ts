export class EventCreationThroughAPI
{

    apiContext : any;
    loginPayload : any;


    constructor(apiContext: any , loginPayLoad : any) {
        this.apiContext = apiContext;
        this.loginPayload = loginPayLoad
    }

    async getToken(): Promise<string>{
        const loginResponse = await this.apiContext.post("https://api.eventhub.rahulshettyacademy.com/api/auth/login",
            {
            data : this.loginPayload
             })

            //expect (loginResponse.ok()).tobeTruthy()
            const loginResponseJson = await loginResponse.json()
           return loginResponseJson.token
           
        
    }


 async eventCreation(eventPayload: any ){
   
    const token = await this.getToken()
  
    const eventResponse = await this.apiContext.post('https://api.eventhub.rahulshettyacademy.com/api/events',
    {
        data : eventPayload,
    headers :{
        'Authorization': `Bearer ${token}`,
        'Content-Type' : 'application/json'
    }

})
const eventResponseJson = await eventResponse.json()
console.log('Event Response:',  eventResponseJson)

return {
    token : token,
    eventID : eventResponseJson.data.id,
    eventTitle : eventResponseJson.data.title
}
 }


}