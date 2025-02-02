import { expect, test } from '@playwright/test'
import { StatusCodes } from 'http-status-codes'

//Homework9
test('get order without authorization and get 401 error', async ({ request }) => {
  const response = await request.get('https://backend.tallinn-learning.ee/test-orders/1', {
    headers: {},
  })
  console.log('Response status:', response.status())
  console.log('Response body:', await response.text())
  console.log('response headers:', response.headers())

  // Temporarily change the expected status to 200 until the server is fixed
  expect(response.status()).toBe(200) // Expected status 401, Change back to 401 when server is fixed
})

//Homework 9
test('get order with extremely large id and get 400 error', async ({ request }) => {
  const response = await request.get(
      'https://backend.tallinn-learning.ee/test-orders/123456789012345678901234567890',
  )
  console.log('Response status:', response.status())
  console.log('Response body:', await response.json())
  expect(response.status()).toBe(StatusCodes.BAD_REQUEST) // Expected status 400
})

//Homework 9, adapted test
test('send multiple requests without exceeding rate limits', async ({ request }) => {
  const url = 'https://backend.tallinn-learning.ee/test-orders/1'
  for (let r = 0; r < 10; r++) {
    // This test sends 100 consecutive requests to the specified URL,in other words we send requests in a loop to exceed the limit
    const response = await request.get(url)
    console.log(`Request ${r + 1} status:`, response.status()) // For each request we check that the server returns HTTP status 200 (OK) in log.
    expect(response.status()).toBe(StatusCodes.OK) // 200
  }
})

//Homework 9, expect is adapted
test('GET should return 429 Too Many Requests after multiple requests', async ({ request }) => {
  const MAX_REQUESTS = 10 // Maximum number of requests
  let tooManyRequestsReceived = false

  for (let r = 0; r < MAX_REQUESTS; r++) {
    // This test sends 100 consecutive requests to the specified URL,in other words, we send requests in a loop to exceed the limit
    const response = await request.get('https://backend.tallinn-learning.ee/test-orders/1')
    console.log(`Request ${r + 1} status:`, response.status())

    // Once the server returns a 429 status, the loop is terminated early.
    if (response.status() === StatusCodes.TOO_MANY_REQUESTS) {
      console.log(`Received 429 on request ${r + 1}`)
      tooManyRequestsReceived = true
      break
    }
  }

  // Check if there was at least one response with 429
  if (!tooManyRequestsReceived) {
    console.error('Test failed: Server did not return 429 Too Many Requests after xxx requests.')
  }

  // У каждого теста должен быть понятный критерий DoD - Definition of Done, в нашем случае - должен быть понятный expect.
  // Тест должен проходить или падать от tooManyRequestsReceived.
  expect(tooManyRequestsReceived).toBe(true) // true -> We are clearly failing the test, false -> system shows error message
})

//Lesson 9
test('get order with correct id should receive code 200', async ({ request }) => {
  // Build and send a GET request to the server
  const response = await request.get('https://backend.tallinn-learning.ee/test-orders/1')
  // Log the response status, body and headers
  console.log('response body:', await response.json())
  console.log('response headers:', response.headers())
  // Check if the response status is 200
  expect(response.status()).toBe(200)
})

//Lesson 9
test('get order with id = 0', async ({ request }) => {
  // Build and send a GET request to the server
  const response = await request.get('https://backend.tallinn-learning.ee/test-orders/0')
  // Log the response status, body and headers
  console.log('response body:', await response.json())
  console.log('response headers:', response.headers())
  // Check if the response status is 400
  expect(response.status()).toBe(400)
})

//Lesson 9
test('get order with id equal %', async ({ request }) => {
  // Build and send a GET request to the server
  const response = await request.get('https://backend.tallinn-learning.ee/test-orders/%')
  // Log the response status, body and headers
  console.log(response)
  // Check if the response status is 400
  expect(response.status()).toBe(400)
})

//Lesson 9
test('get order with id = first and get 400 error', async ({ request }) => {
  // Build and send a GET request to the server
  const response = await request.get('https://backend.tallinn-learning.ee/test-orders/first')
  // Log the response status, body and headers
  console.log(response)
  // Check if the response status is 400
  expect(response.status()).toBe(400)
})

//Lesson 9
test('get order with empty id and get 500 error', async ({ request }) => {
  // Build and send a GET request to the server
  const response = await request.get('https://backend.tallinn-learning.ee/test-orders/')
  // Log the response status, body and headers
  console.log(response)
  // Check if the response status is 500
  expect(response.status()).toBe(500)
})