import { useState, useRef, useCallback, RefObject } from 'react'

export type StateType<IState> = { [key: string]: IState; [key: number]: IState }
export type StateReturnsType<S> = [S, SetMergeType<S>, RefObject<S>]
export type MergeFnType = (obj1: {}, obj2: {}) => {}
export type SetMergeStateOrFnType<S> =
  | object
  | ((currentState: S, mergeFn: MergeFnType) => S)
export type SetMergeCallbackType<S> = (currentState: S) => void
export type SetMergeType<S> = (
  newStateOrSetter: SetMergeStateOrFnType<S>,
  callback?: SetMergeCallbackType<S>,
) => void

const merge: MergeFnType = (obj1, obj2) => ({ ...obj1, ...obj2 })

export const useMergeState = <S = {}>(initialState: S): StateReturnsType<S> => {
  const [state, setState] = useState(initialState)
  const stateRef = useRef(state)
  stateRef.current = state

  const setMergeState: SetMergeType<S> = useCallback(
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

  return [state, setMergeState, stateRef]
}

export default useMergeState
