import { APIRequestContext } from 'playwright-core';
import { LoginDTO } from '../tests/dto/LoginDTO';
import { StatusCodes } from 'http-status-codes';
import { OrderDto } from '../tests/dto/OrderDto';
import { expect } from '@playwright/test';

const serviceURL = 'https://backend.tallinn-learning.ee/';
const loginPath = 'login/student';
const orderPath = 'orders';

export class ApiClient {
    static instance: ApiClient;
    private request: APIRequestContext;
    jwt: string = '';

    private constructor(request: APIRequestContext) {
        this.request = request;
    }

    public static async getInstance(request: APIRequestContext): Promise<ApiClient> {
        if (!ApiClient.instance) {
            const instance = new ApiClient(request);
            await instance.requestJwt();
            ApiClient.instance = instance;
        }
        return ApiClient.instance;
    }

    async requestJwt(): Promise<void> {
        console.log('Requesting JWT');
        const responseLogin = await this.request.post(`${serviceURL}${loginPath}`, {
            data: LoginDTO.createLoginWithCorrectData(),
        });
        console.log('Login response:', responseLogin.status());
        if (responseLogin.status() !== StatusCodes.OK) {
            throw new Error(`Request failed with status ${responseLogin.status()}`);
        }
        this.jwt = await responseLogin.text();
        console.log(`JWT received: ${this.jwt}`);
    }

    async createOrderAndReturnOrderId(): Promise<number> {
        const response = await this.request.post(`${serviceURL}${orderPath}`, {
            data: OrderDto.generateRandomOrderDto(),
            headers: { Authorization: `Bearer ${this.jwt}` },
        });
        console.log('Create order response:', response.status());
        expect(response.status()).toBe(StatusCodes.OK);
        const responseBody = await response.json();
        console.log('Created order:', responseBody);
        return responseBody.id;
    }

    async getOrderById(orderId: number): Promise<any> {
        const response = await this.request.get(`${serviceURL}${orderPath}/${orderId}`, {
            headers: { Authorization: `Bearer ${this.jwt}` },
        });
        console.log(`Get order ${orderId} response:`, response.status());
        expect(response.status()).toBe(StatusCodes.OK);
        const responseBody = await response.json();
        console.log('Fetched order:', responseBody);
        return responseBody;
    }

    async deleteOrder(orderId: number): Promise<void> {
        const response = await this.request.delete(`${serviceURL}${orderPath}/${orderId}`, {
            headers: { Authorization: `Bearer ${this.jwt}` },
        });
        console.log(`Delete order ${orderId} response:`, response.status());
        expect(response.status()).toBe(StatusCodes.OK);
        const responseBody = await response.json();
        console.log('Delete response body:', responseBody);
        expect(responseBody).toBe(true);
    }

    async isOrderDeleted(orderId: number): Promise<void> {
        const response = await this.request.get(`${serviceURL}${orderPath}/${orderId}`, {
            headers: { Authorization: `Bearer ${this.jwt}` },
        });
        console.log(`Check deleted order ${orderId} response:`, response.status());
        expect(response.status()).toBe(StatusCodes.OK);
        const responseBody = await response.text();
        console.log('Response body after delete:', responseBody);
        expect(responseBody).toBe('');
    }
}