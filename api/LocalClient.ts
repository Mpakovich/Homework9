import { UserDTO } from "../tests/dto/UserDTO";
import { APIRequestContext } from "playwright";
import { expect } from "@playwright/test";
import { StatusCodes } from "http-status-codes";

const serviceURL = 'http://localhost:3000';
const path = 'users';

export class LocalClient {
    private request: APIRequestContext;

    constructor(request: APIRequestContext) {
        this.request = request;
    }

    async createUser(): Promise<UserDTO> {
        const response = await this.request.post(`${serviceURL}/${path}`);
        expect(response.status()).toBe(StatusCodes.CREATED);
        return UserDTO.serializeResponse(await response.json());
    }

    async createMultipleUsers(count: number): Promise<UserDTO[]> {
        const users: UserDTO[] = [];
        for (let i = 0; i < count; i++) {
            users.push(await this.createUser());
        }
        return users;
    }

    async getUserById(userId: number): Promise<UserDTO | null> {
        const response = await this.request.get(`${serviceURL}/${path}/${userId}`);
        if (response.status() === StatusCodes.NOT_FOUND) {
            return null;
        }
        expect(response.status()).toBe(StatusCodes.OK);
        return UserDTO.serializeResponse(await response.json());
    }

    async getAllUsers(): Promise<UserDTO[]> {
        const response = await this.request.get(`${serviceURL}/${path}`);
        expect(response.status()).toBe(StatusCodes.OK);
        return (await response.json()).map((user: any) => UserDTO.serializeResponse(user));
    }

    async deleteUser(userId: number): Promise<void> {
        const response = await this.request.delete(`${serviceURL}/${path}/${userId}`);
        expect(response.status()).toBe(StatusCodes.OK);
    }

    async deleteAllUsers(): Promise<void> {
        const users = await this.getAllUsers();
        for (const user of users) {
            await this.deleteUser(user.id);
        }
    }

    async deleteMultipleUsers(userIds: number[]): Promise<void> {
        for (const userId of userIds) {
            await this.deleteUser(userId);
        }
    }
}