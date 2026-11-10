import React from 'react'
import { render, fireEvent } from '@testing-library/react-native'

import { GiftedChat } from '..'

const messages = [
  {
    _id: 1,
    text: 'Hello developer',
    createdAt: new Date(),
    user: {
      _id: 2,
      name: 'John Doe',
    },
  },
]

it('should render <GiftedChat/> and compare with snapshot', async () => {
  const { toJSON } = await render(
    <GiftedChat
      messages={messages}
      onSend={() => {}}
      user={{
        _id: 1,
      }}
    />
  )

  expect(toJSON()).toMatchSnapshot()
})

it('preserves the default `text` prop on initial render (#603)', async () => {
  const { getByDisplayValue, getByTestId } = await render(
    <GiftedChat
      messages={messages}
      onSend={() => {}}
      user={{
        _id: 1,
      }}
      text='test'
    />
  )

  // Mount the input toolbar by simulating the initial layout pass (this is also
  // where the text-init/reset logic runs that #603 reported as clearing text).
  await fireEvent(getByTestId('GC_WRAPPER'), 'layout', {
    nativeEvent: { layout: { x: 0, y: 0, width: 400, height: 800 } },
  })

  // The composer must show the provided default text, not a cleared value.
  expect(getByDisplayValue('test')).toBeTruthy()
})

it('should render <GiftedChat/> with light colorScheme and compare with snapshot', async () => {
  const { toJSON } = await render(
    <GiftedChat
      messages={messages}
      onSend={() => {}}
      user={{
        _id: 1,
      }}
      colorScheme='light'
    />
  )

  expect(toJSON()).toMatchSnapshot()
})

it('should render <GiftedChat/> with dark colorScheme and compare with snapshot', async () => {
  const { toJSON } = await render(
    <GiftedChat
      messages={messages}
      onSend={() => {}}
      user={{
        _id: 1,
      }}
      colorScheme='dark'
    />
  )

  expect(toJSON()).toMatchSnapshot()
})

const findKeyboardProviders = (tree: any): any[] => {
  if (tree == null || typeof tree !== 'object')
    return []

  const children = (Array.isArray(tree) ? tree : tree.children ?? []) as any[]
  const nested = children.flatMap(findKeyboardProviders)

  return tree.type === 'KeyboardProvider' ? [tree, ...nested] : nested
}

it('does not force the system bars translucent on the app window (#2755)', async () => {
  // Those props tell Android "the app already draws behind the system bars", and the
  // provider answers by zeroing the activity content view's margins - a window-level
  // change it never undoes, so the host app stays under the navigation bar after the
  // chat screen is gone. Only the app knows whether it is edge-to-edge.
  const [provider] = findKeyboardProviders(
    (await render(<GiftedChat messages={messages} onSend={() => {}} user={{ _id: 1 }} />)).toJSON()
  )

  expect(provider).toBeDefined()
  expect(provider.props.statusBarTranslucent).toBeUndefined()
  expect(provider.props.navigationBarTranslucent).toBeUndefined()
})

it('still lets `keyboardProviderProps` set the translucency explicitly', async () => {
  const { toJSON } = await render(
    <GiftedChat
      messages={messages}
      onSend={() => {}}
      user={{ _id: 1 }}
      keyboardProviderProps={{ statusBarTranslucent: true, navigationBarTranslucent: true }}
    />
  )
  const [provider] = findKeyboardProviders(toJSON())

  expect(provider.props.statusBarTranslucent).toBe(true)
  expect(provider.props.navigationBarTranslucent).toBe(true)
})
