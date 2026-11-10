import React from 'react'
import { StyleSheet } from 'react-native'
import { act } from '@testing-library/react-native'

import { MessagesContainer } from '..'
import { DEFAULT_TEST_MESSAGE } from './data'
import { render } from './renderWithGestureRoot'

// The shipped mock records listeners but never calls them, so keyboard transitions are
// unobservable. Swap in a tiny emitter and keep everything else it provides.
const mockKeyboardListeners = new Map<string, Set<() => void>>()

jest.mock('react-native-keyboard-controller', () => ({
  ...jest.requireActual('react-native-keyboard-controller/jest'),
  KeyboardController: {
    ...jest.requireActual('react-native-keyboard-controller/jest').KeyboardController,
    isVisible: () => false,
  },
  KeyboardEvents: {
    addListener: (event: string, listener: () => void) => {
      const listeners = mockKeyboardListeners.get(event) ?? new Set()
      listeners.add(listener)
      mockKeyboardListeners.set(event, listeners)

      return { remove: () => listeners.delete(listener) }
    },
  },
}))

const emitKeyboardEvent = async (event: 'keyboardWillShow' | 'keyboardWillHide') =>
  await act(() => {
    mockKeyboardListeners.get(event)?.forEach(listener => listener())
  })

const MESSAGES = [
  { ...DEFAULT_TEST_MESSAGE, _id: 'test1' },
  { ...DEFAULT_TEST_MESSAGE, _id: 'test2' },
]

const getListContentStyle = (tree: any): Record<string, unknown> => {
  const findList = (node: any): any => {
    if (node == null || typeof node !== 'object')
      return undefined

    if (node.props?.contentContainerStyle !== undefined)
      return node

    const children = (Array.isArray(node) ? node : node.children ?? []) as any[]

    return children.reduce<any>((found, child) => found ?? findList(child), undefined)
  }

  return StyleSheet.flatten(findList(tree)?.props?.contentContainerStyle) ?? {}
}

beforeEach(() => mockKeyboardListeners.clear())

it('leaves the content container alone by default', async () => {
  const { toJSON } = await render(<MessagesContainer messages={MESSAGES} user={{ _id: 1 }} />)

  expect(getListContentStyle(toJSON())).not.toHaveProperty('justifyContent')
})

it('pins a short conversation to the top when isAlignedTop is set', async () => {
  // Inverted lists are flipped, so the content container's end is the visual top.
  const { toJSON } = await render(
    <MessagesContainer messages={MESSAGES} user={{ _id: 1 }} isAlignedTop />
  )

  expect(getListContentStyle(toJSON())).toMatchObject({
    flexGrow: 1,
    justifyContent: 'flex-end',
  })
})

it('flips the alignment for a non-inverted list', async () => {
  const { toJSON } = await render(
    <MessagesContainer messages={MESSAGES} user={{ _id: 1 }} isAlignedTop isInverted={false} />
  )

  expect(getListContentStyle(toJSON())).toMatchObject({
    flexGrow: 1,
    justifyContent: 'flex-start',
  })
})

it('re-anchors to the bottom while the keyboard is open with isAlignedTop=auto (#2736)', async () => {
  const { toJSON } = await render(
    <MessagesContainer messages={MESSAGES} user={{ _id: 1 }} isAlignedTop='auto' />
  )

  expect(getListContentStyle(toJSON())).toMatchObject({ justifyContent: 'flex-end' })

  await emitKeyboardEvent('keyboardWillShow')
  expect(getListContentStyle(toJSON())).toMatchObject({ justifyContent: 'flex-start' })

  await emitKeyboardEvent('keyboardWillHide')
  expect(getListContentStyle(toJSON())).toMatchObject({ justifyContent: 'flex-end' })
})

it('does not react to the keyboard unless isAlignedTop is auto', async () => {
  const { toJSON } = await render(
    <MessagesContainer messages={MESSAGES} user={{ _id: 1 }} isAlignedTop />
  )

  expect(mockKeyboardListeners.size).toBe(0)

  await emitKeyboardEvent('keyboardWillShow')
  expect(getListContentStyle(toJSON())).toMatchObject({ justifyContent: 'flex-end' })
})

it('keeps a custom listProps.contentContainerStyle alongside the alignment', async () => {
  const { toJSON } = await render(
    <MessagesContainer
      messages={MESSAGES}
      user={{ _id: 1 }}
      isAlignedTop
      listProps={{ contentContainerStyle: { paddingBottom: 42 } }}
    />
  )

  expect(getListContentStyle(toJSON())).toMatchObject({
    paddingBottom: 42,
    flexGrow: 1,
    justifyContent: 'flex-end',
  })
})
