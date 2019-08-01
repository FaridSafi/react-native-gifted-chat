import { isSameDay, isSameUser } from '../utils'

it('should test if same day', () => {
  const now = new Date()
  expect(
    isSameDay(
      {
        _id: 1,
        text: 'test',
        createdAt: now,
        user: { _id: 1 },
      },
      {
        _id: 2,
        text: 'test2',
        createdAt: now,
        user: { _id: 2 },
      },
    ),
  ).toBe(true)
})

it('should test if same user', () => {
  const message = {
    _id: 1,
    text: 'test',
    createdAt: new Date(),
    user: { _id: 1 },
  }
  expect(isSameUser(message, message)).toBe(true)
})
