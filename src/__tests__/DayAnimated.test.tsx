import React from 'react'
import { View, Text } from 'react-native'
import { render } from '@testing-library/react-native'
import { DayProps } from '../Day'
import { DayAnimated } from '../MessagesContainer/components/DayAnimated'
import { DEFAULT_TEST_MESSAGE } from './data'

const mockDaysPositions = { value: {} }
const mockScrolledY = { value: 0 }
const mockListHeight = { value: 800 }

describe('DayAnimated', () => {
  it('should render DayAnimated with default Day component', () => {
    const { toJSON } = render(
      <DayAnimated
        scrolledY={mockScrolledY}
        daysPositions={mockDaysPositions}
        listHeight={mockListHeight}
        messages={[DEFAULT_TEST_MESSAGE]}
        isLoading={false}
      />
    )
    expect(toJSON()).toMatchSnapshot()
  })

  it('should use custom renderDay when provided', () => {
    const customRenderDay = jest.fn((props: DayProps) => (
      <View testID='custom-day'>
        <Text>Custom Day: {props.createdAt.toLocaleString()}</Text>
      </View>
    ))

    const { toJSON } = render(
      <DayAnimated
        scrolledY={mockScrolledY}
        daysPositions={mockDaysPositions}
        listHeight={mockListHeight}
        messages={[DEFAULT_TEST_MESSAGE]}
        isLoading={false}
        renderDay={customRenderDay}
      />
    )

    expect(toJSON()).toMatchSnapshot()
  })
})
