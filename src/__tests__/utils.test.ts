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

it('test both undefined createdAt for same day', () => {
  expect(
    isSameDay({
      _id: 1,
      text: 'test',
      user: {_id: 1}
    }, {
      _id: 2,
      text: 'test2',
      user: {_id: 2}
    })
  ).toBe(true)
})

it('should test undefined currentMessage.createdAt for same day', () => {
  const now = new Date()

  expect(
    isSameDay({
      _id: 1,
      text: 'test',
      user: {_id: 1}
    }, {
      _id: 2,
      text: 'test2',
      createdAt: now,
      user: {_id: 2}
    })
  ).toBe(false)
})

it('should test undefined diffMessage.createdAt for same day', () => {
  const now = new Date()

  expect(
    isSameDay({
      _id: 1,
      text: 'test',
      createdAt: now,
      user: {_id: 1}
    }, {
      _id: 2,
      text: 'test2',
      user: {_id: 2}
    })
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
