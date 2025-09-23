import { useCallback, useEffect, useRef } from 'react'
import dayjs from 'dayjs'
import { IMessage } from './types'

export function isSameDay (
  currentMessage: IMessage,
  diffMessage: IMessage | null | undefined
) {
  if (!diffMessage || !diffMessage.createdAt)
    return false

  const currentCreatedAt = dayjs(currentMessage.createdAt)
  const diffCreatedAt = dayjs(diffMessage.createdAt)

  if (!currentCreatedAt.isValid() || !diffCreatedAt.isValid())
    return false

  return currentCreatedAt.isSame(diffCreatedAt, 'day')
}

export function isSameUser (
  currentMessage: IMessage,
  diffMessage: IMessage | null | undefined
) {
  return !!(
    diffMessage &&
    diffMessage.user &&
    currentMessage.user &&
    diffMessage.user._id === currentMessage.user._id
  )
}

export function useCallbackDebounced (time: number, callbackFunc: (...args: any[]) => void, deps: any[] = []) {
  const timeoutId = useRef<ReturnType<typeof setTimeout>>(undefined)

  // we use function instead of arrow to access arguments object
  const savedFunc = useCallback(function () {
    const args = arguments
    const [e, ...rest] = args
    const { nativeEvent } = e || {}

    let params = []
    if (e) {
      if (nativeEvent)
        params.push({ nativeEvent })
      else
        params.push(e)
      if (rest)
        params = params.concat(rest)
    }

    clearTimeout(timeoutId.current)
    timeoutId.current = setTimeout(() => {
      callbackFunc(...params)
    }, time)
  }, [callbackFunc, time, deps])

  useEffect(() => {
    return () => {
      clearTimeout(timeoutId.current)
    }
  }, [])

  return savedFunc
}
