import { DependencyList, useLayoutEffect, useRef } from 'react'

/**
 * A custom useEffect hook that only triggers on updates, not on initial mount
 * Idea stolen from: https://stackoverflow.com/a/55075818/1526448
 * @param {()=>void} effect the function to call
 * @param {DependencyList} dependencies the state(s) that fires the update
 */
export function useUpdateLayoutEffect(
  effect: () => void,
  dependencies: DependencyList = [],
) {
  const isInitialMount = useRef(true)

  useLayoutEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false
    } else {
      effect()
    }
  }, dependencies)
}
