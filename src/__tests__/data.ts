import { IMessage } from '../types'

export const DEFAULT_TEST_MESSAGE: IMessage = {
  _id: 'test',
  text: 'test',
  user: { _id: 'test' },
  createdAt: new Date(2022, 3, 17),
}
