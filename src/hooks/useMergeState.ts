import { useState, useRef, useCallback } from 'react'

const merge = (obj1: {}, obj2: {}) => ({ ...obj1, ...obj2 })

export const useMergeState = (initialState: { [key: string]: any }) => {
  const [state, setState] = useState(initialState)
  const stateRef = useRef(state)
  stateRef.current = state

  const setMergedState = useCallback(
    (newState, callback) => {
      setState(
        typeof newState === 'function'
          ? newState(stateRef.current, merge)
          : merge(stateRef.current, newState),
      )
      if (callback) {
        callback(stateRef.current)
      }
    },
    [stateRef],
  )

  return [state, setMergedState, stateRef]
}

export default useMergeState
