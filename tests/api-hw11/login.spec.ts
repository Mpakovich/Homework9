import { expect, test } from '@playwright/test'
import { LoginDTO } from '../dto/LoginDTO'
import { StatusCodes } from 'http-status-codes'

test.describe('Login tests', () => {
  test('Successful authorization', async ({ request }) => {
    const response = await request.post(`https://backend.tallinn-learning.ee/login/student`, {
      data: LoginDTO.createLoginWithCorrectData(),
    })

    console.log('Response body:', await response.text())
    expect(response.status()).toBe(StatusCodes.OK)

    expect(await response.text()).toMatch(/^eyJhb[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/)
  })

  test('Unsuccessful authorization with wrong HTTP method', async ({ request }) => {
    const response = await request.get(`https://backend.tallinn-learning.ee/login/student`, {
      data: LoginDTO.createLoginWithCorrectData(),
    })

    console.log('Response body:', await response.json())
    expect(response.status()).toBe(StatusCodes.METHOD_NOT_ALLOWED)
  })
})
