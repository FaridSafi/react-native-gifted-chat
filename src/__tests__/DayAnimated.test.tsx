import 'react-native'
import React from 'react'
import renderer from 'react-test-renderer'
import { DayAnimated } from '../MessageContainer/components/DayAnimated'
import { DayProps } from '../Day'

const mockDaysPositions = { value: {} }
const mockScrolledY = { value: 0 }
const mockListHeight = { value: 800 }

const mockMessage = {
  _id: 1,
  text: 'Hello',
  createdAt: new Date('2023-01-01'),
  user: { _id: 1, name: 'User 1' }
}

describe('DayAnimated', () => {
  it('should render DayAnimated with default Day component', () => {
    const component = renderer.create(
      <DayAnimated
        scrolledY={mockScrolledY}
        daysPositions={mockDaysPositions}
        listHeight={mockListHeight}
        messages={[mockMessage]}
        isLoadingEarlier={false}
      />
    )
    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('should use custom renderDay when provided', () => {
    const customRenderDay = jest.fn((props: DayProps) => <div data-testid="custom-day">Custom Day: {props.createdAt}</div>)
    
    const component = renderer.create(
      <DayAnimated
        scrolledY={mockScrolledY}
        daysPositions={mockDaysPositions}
        listHeight={mockListHeight}
        messages={[mockMessage]}
        isLoadingEarlier={false}
        renderDay={customRenderDay}
      />
    )
    
    // Force render to trigger the renderDay call if there's a createdAt
    component.getInstance()
    
    // The custom renderDay function should be available in the component
    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })
})