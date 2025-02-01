import { expect, test } from '@playwright/test'
import { LoginDTO } from '../dto/LoginDTO'
import { StatusCodes } from 'http-status-codes'

test.describe('Login tests', async () => {
  test('Successful authorization', async ({ request }) => {
    const response = await request.post(`https://backend.tallinn-learning.ee/login/student`, {
      data: LoginDTO.createLoginWithCorrectData(),
    })

    console.log(await response.text())
    expect(response.status()).toBe(StatusCodes.OK)

    // Проверка JWT с использованием expect
    expect(await response.text()).toMatch(/^eyJhb[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/)
  })

  test('Unsuccessful authorization with wrong HTTP method', async ({ request }) => {
    const response = await request.get(`https://backend.tallinn-learning.ee/login/student`, {
      data: LoginDTO.createLoginWithCorrectData(),
    })

    console.log(await response.json())
    expect(response.status()).toBe(StatusCodes.METHOD_NOT_ALLOWED)
  })
})
