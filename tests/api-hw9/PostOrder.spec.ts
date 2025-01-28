import { expect, test } from '@playwright/test'

import { StatusCodes } from 'http-status-codes'

// Home work9
test('Post order with unsupported status value should receive code 400', async ({ request }) => {
  const requestBody = {
    status: 'INVALID_STATUS', // Unsupported value
    courierId: 0,
    customerName: 'John Doe',
    customerPhone: '+1234567890',
    comment: 'Urgent delivery',
    id: 1,
  }

  const response = await request.post('https://backend.tallinn-learning.ee/test-orders', {
    data: requestBody,
  })

  const responseBody = await response.text()

  console.log('response status:', response.status())
  console.log('response body:', responseBody)

  expect(response.status()).toBe(StatusCodes.BAD_REQUEST)
})

//Homework 9
test('Post order with empty data should receive code 400', async ({ request }) => {
  const response = await request.post('https://backend.tallinn-learning.ee/test-orders', {
    data: {}, // Empty data
  })

  const responseBody = await response.json()

  console.log('response status:', response.status())
  console.log('response body:', responseBody)

  expect(response.status()).toBe(StatusCodes.BAD_REQUEST) //expect result status 400, Received status 200 test failed
})

//Homework9
test('Post order with invalid customerPhone should receive code 400', async ({ request }) => {
  const requestBody = {
    status: 'OPEN',
    courierId: 0,
    customerName: 'John Doe',
    customerPhone: 12, // wrong phone number
    comment: 'Urgent delivery',
    id: 1,
  }

  const response = await request.post('https://backend.tallinn-learning.ee/test-orders', {
    data: requestBody,
  })

  const responseBody = await response.json()

  console.log('response status:', response.status())
  console.log('response body:', responseBody)

  expect(response.status()).toBe(StatusCodes.BAD_REQUEST) //expect result status 400, Received status 200 test failed
})

//Lesson 9 same testcases in simple-solution-api.spec.ts
test('123 post order with correct data should receive code 201', async ({ request }) => {
  // prepare request body
  const requestBody = {
    status: 'OPEN',
    courierId: 0,
    customerName: 'string',
    customerPhone: 'string',
    comment: 'string',
    id: 0,
  }

  // Send a POST request to the server
  const response = await request.post('https://backend.tallinn-learning.ee/test-orders', {
    data: requestBody,
  })
  const responseBody = await response.json()

  // Log the response status and body
  console.log('response status:', response.status())
  console.log('response body:', responseBody)
  expect(response.status()).toBe(StatusCodes.OK)
  expect(responseBody.status).toBe('OPEN')
})
//Lesson 9
test('post order with data without status field should receive code 200', async ({ request }) => {
  // prepare request body
  const requestBody = {
    courierId: 0,
    customerName: 'string',
    customerPhone: 'string',
    comment: 'string',
    id: 0,
  }
  // Send a POST request to the server
  const response = await request.post('https://backend.tallinn-learning.ee/test-orders', {
    data: requestBody,
  })
  const responseBody = await response.json()

  // Log the response status and body
  console.log('response status:', response.status())
  console.log('response body:', responseBody)
  expect(response.status()).toBe(StatusCodes.OK)
  expect(responseBody.status).toBeNull()
})

//Lesson 9
test('post order with empty data should receive code 200', async ({ request }) => {
  // prepare request body
  const requestBody = {}
  // Send a POST request to the server
  const response = await request.post('https://backend.tallinn-learning.ee/test-orders', {
    data: requestBody,
  })
  const responseBody = await response.json()

  // Log the response status and body
  console.log('response status:', response.status())
  console.log('response body:', responseBody)
  expect(response.status()).toBe(StatusCodes.OK)
  expect(responseBody.status).toBeNull()
})
