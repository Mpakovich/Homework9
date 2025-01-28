import { expect, test } from '@playwright/test'
import { StatusCodes } from 'http-status-codes'

test('Delete order with valid ID and get 204 OK', async ({ request }) => {
  const requestHeaders = {
    api_key: '1234567895678998',
  }
  const response = await request.delete('https://backend.tallinn-learning.ee/test-orders/1', {
    headers: requestHeaders,
  })
  console.log('Response status:', response.status())
  expect(response.status()).toBe(204)
})

test('Delete order with empty ID and get 405 error', async ({ request }) => {
  const requestHeaders = {
    api_key: '1234567895678998',
  }
  const response = await request.delete('https://backend.tallinn-learning.ee/test-orders/', {
    headers: requestHeaders,
  })
  console.log('Response status:', response.status())
  expect(response.status()).toBe(405) //expected status 405
})

test('Delete order with invalid token and get 401 error', async ({ request }) => {
  const response = await request.delete('http://backend.tallinn-learning.ee/test-orders/1', {
    headers: {
      api_key: '128',
    },
  })
  console.log('Response status:', response.status())
  expect(response.status()).toBe(StatusCodes.UNAUTHORIZED) //Expected status 401
})

test('Delete order with invalid ID format and get 400 error', async ({ request }) => {
  const response = await request.delete(
    'http://backend.tallinn-learning.ee/test-orders/invalid-id',
    {},
  )
  console.log('Response status:', response.status())
  expect(response.status()).toBe(StatusCodes.BAD_REQUEST) //Expected status 400
})

test('Delete order with empty api_key and get 401 error', async ({ request }) => {
  const response = await request.delete('http://backend.tallinn-learning.ee/test-orders/1', {
    headers: {
      api_key: '',
    },
  })
  console.log('Response status:', response.status())
  expect(response.status()).toBe(StatusCodes.UNAUTHORIZED) //Expected status 401
})
