
const { request } = require('@playwright/test');

async function createAuthorizedApiContext(playwright, email, password) {

  const loginContext = await request.newContext();

  const loginResponse = await loginContext.post(
    'https://api.eventhub.rahulshettyacademy.com/api/auth/login',
    {
      data: {
        email,
        password
      }
    }
  );

  const loginData = await loginResponse.json();

  const token = loginData.token;

  const apiContext = await request.newContext({
    extraHTTPHeaders: {
      Authorization: `Bearer ${token}`
    }
  });

  return { apiContext, token };
}

module.exports = {createAuthorizedApiContext}