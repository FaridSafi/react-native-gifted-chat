import React from 'react'
import { View, Text } from 'react-native'
import { render } from '@testing-library/react-native'
import { DayProps } from '../Day'
import DayAnimated from '../MessageContainer/components/DayAnimated'

const mockDaysPositions = { value: {} }
const mockScrolledY = { value: 0 }
const mockListHeight = { value: 800 }

const mockMessage = {
  _id: 1,
  text: 'Hello',
  createdAt: new Date('2023-01-01'),
  user: { _id: 1, name: 'User 1' },
}

describe('DayAnimated', () => {
  it('should render DayAnimated with default Day component', () => {
    const { toJSON } = render(
      <DayAnimated
        scrolledY={mockScrolledY}
        daysPositions={mockDaysPositions}
        listHeight={mockListHeight}
        messages={[mockMessage]}
        isLoadingEarlier={false}
      />
    )
    expect(toJSON()).toMatchSnapshot()
  })

  it('should use custom renderDay when provided', () => {
    const customRenderDay = jest.fn((props: DayProps) => (
      <View testID='custom-day'>
        <Text>Custom Day: {props.createdAt}</Text>
      </View>
    ))

    const { toJSON } = render(
      <DayAnimated
        scrolledY={mockScrolledY}
        daysPositions={mockDaysPositions}
        listHeight={mockListHeight}
        messages={[mockMessage]}
        isLoadingEarlier={false}
        renderDay={customRenderDay}
      />
    )

    expect(toJSON()).toMatchSnapshot()
  })
})
