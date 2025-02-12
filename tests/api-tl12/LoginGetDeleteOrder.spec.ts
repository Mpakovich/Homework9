import { expect, test } from '@playwright/test'
import { StatusCodes } from 'http-status-codes'
import { OrderDto } from '../dto/OrderDto'
import { ApiClient } from '../../api/ApiClient'
import { LoginDTO } from '../dto/LoginDTO'

test.describe('Order tests without API Client', async () => {
    test('TL-12-1 Authorization and get order by ID', async ({ request }) => {
        const responseLogin = await request.post('https://backend.tallinn-learning.ee/login/student', {
            data: LoginDTO.createLoginWithCorrectData(),
        })
        console.log('Login response:', responseLogin.status())
        expect(responseLogin.status()).toBe(StatusCodes.OK)
        const jwt = await responseLogin.text()

        const responseCreateOrder = await request.post('https://backend.tallinn-learning.ee/orders', {
            data: OrderDto.generateRandomOrderDto(),
            headers: { Authorization: `Bearer ${jwt}` },
        })
        console.log('Create order response:', responseCreateOrder.status())
        expect(responseCreateOrder.status()).toBe(StatusCodes.OK)
        const createdOrder = await responseCreateOrder.json()
        console.log('Created order:', createdOrder)

        const responseGetOrder = await request.get(
            `https://backend.tallinn-learning.ee/orders/${createdOrder.id}`,
            {
                headers: { Authorization: `Bearer ${jwt}` },
            },
        )
        console.log(`Get order ${createdOrder.id} response:`, responseGetOrder.status())
        expect(responseGetOrder.status()).toBe(StatusCodes.OK)
        const fetchedOrder = await responseGetOrder.json()
        console.log('Fetched order:', fetchedOrder)
        expect(fetchedOrder.id).toBe(createdOrder.id)
    })

    test('TL-12-2 Authorization and delete order by ID', async ({ request }) => {
        const responseLogin = await request.post('https://backend.tallinn-learning.ee/login/student', {
            data: LoginDTO.createLoginWithCorrectData(),
        })
        console.log('Login response:', responseLogin.status())
        expect(responseLogin.status()).toBe(StatusCodes.OK)
        const jwt = await responseLogin.text()

        const responseCreateOrder = await request.post('https://backend.tallinn-learning.ee/orders', {
            data: OrderDto.generateRandomOrderDto(),
            headers: { Authorization: `Bearer ${jwt}` },
        })
        console.log('Create order response:', responseCreateOrder.status())
        expect(responseCreateOrder.status()).toBe(StatusCodes.OK)
        const createdOrder = await responseCreateOrder.json()
        console.log('Created order:', createdOrder)

        const responseDelete = await request.delete(
            `https://backend.tallinn-learning.ee/orders/${createdOrder.id}`,
            {
                headers: { Authorization: `Bearer ${jwt}` },
            },
        )
        console.log(`Delete order ${createdOrder.id} response:`, responseDelete.status())
        expect(responseDelete.status()).toBe(StatusCodes.OK)
        expect(await responseDelete.json()).toBe(true)

        const responseGetAfterDelete = await request.get(
            `https://backend.tallinn-learning.ee/orders/${createdOrder.id}`,
            {
                headers: { Authorization: `Bearer ${jwt}` },
            },
        )
        console.log(`Check deleted order ${createdOrder.id} response:`, responseGetAfterDelete.status())
        expect(responseGetAfterDelete.status()).toBe(StatusCodes.OK)
        const responseBody = await responseGetAfterDelete.text()
        console.log('Response body after delete:', responseBody)
        expect(responseBody).toBe('')
    })
})

test.describe('Order tests with API Client', async () => {
    test('TL-12-3 API Client: Authorization and get order by ID', async ({ request }) => {
        const apiClient = await ApiClient.getInstance(request)
        const orderId = await apiClient.createOrderAndReturnOrderId()
        const order = await apiClient.getOrderById(orderId)
        expect(order.id).toBe(orderId)
    })

    test('TL-12-4 API Client: Authorization and delete order by ID', async ({ request }) => {
        const apiClient = await ApiClient.getInstance(request)
        const orderId = await apiClient.createOrderAndReturnOrderId()
        await apiClient.deleteOrder(orderId)
        await apiClient.isOrderDeleted(orderId)
    })
})