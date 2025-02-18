import { test, expect, request } from '@playwright/test'
import { LocalClient } from '../../api/LocalClient'

test.describe.serial('User API Tests', () => {
  let client: LocalClient

  test.beforeAll(async () => {
    const apiRequest = await request.newContext()
    client = new LocalClient(apiRequest)
  })

  test.beforeEach(async () => {
    await client.deleteAllUsers()
  })

  test('TL-14-1 Verify multiple users creation', async () => {
    const users = await client.createMultipleUsers(5)
    const allUsers = await client.getAllUsers()
    expect(allUsers.length).toBe(users.length)
  })

  test('TL-14-2 Delete all users and verify', async () => {
    await client.createMultipleUsers(5)
    await client.deleteAllUsers()
    const allUsers = await client.getAllUsers()
    expect(allUsers).toEqual([])
  })

  test('TL-14-3 Delete one user does not affect others', async () => {
    const users = await client.createMultipleUsers(5)
    const userToDelete = users[0]
    await client.deleteUser(userToDelete.id)
    const remainingUsers = await client.getAllUsers()

    expect(remainingUsers.length).toBe(4)
    expect(remainingUsers.some((user) => user.id === userToDelete.id)).toBe(false)
  })

  test('TL-14-4 Get user by ID', async () => {
    const user = await client.createUser()
    const fetchedUser = await client.getUserById(user.id)
    expect(fetchedUser).toBeDefined()
    expect(fetchedUser?.id).toBe(user.id)
  })

  test('TL-14-5 Delete multiple users and verify remaining', async () => {
    const users = await client.createMultipleUsers(5)
    const userIdsToDelete = users.slice(0, 2).map((user) => user.id)
    await client.deleteMultipleUsers(userIdsToDelete)

    const remainingUsers = await client.getAllUsers()
    expect(remainingUsers.length).toBe(3)

    for (const id of userIdsToDelete) {
      expect(remainingUsers.some((user) => user.id === id)).toBe(false)
    }
  })
})
