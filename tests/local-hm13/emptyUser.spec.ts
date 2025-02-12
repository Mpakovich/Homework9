import { expect, test } from '@playwright/test'
import { UserDTO } from '../dto/UserDTO'

test('TL-14-5 del all users test', async ({ request }) => {
  const allUsersBefore = await request.get('http://localhost:3000/users')
  const usersBefore: UserDTO[] = await allUsersBefore.json()

  for (const user of usersBefore) {
    await request.delete(`http://localhost:3000/users/${user.id}`)
  }
  const allUsersResponse = await request.get('http://localhost:3000/users')
  const json: UserDTO[] = await allUsersResponse.json()

  expect(json.length).toBe(0)
})
