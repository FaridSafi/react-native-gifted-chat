import React, { useCallback, useEffect, useRef } from 'react';
import dayjs from 'dayjs';
export function renderComponentOrElement(component, props) {
    if (!component)
        return null;
    if (React.isValidElement(component))
        // If it's already a React element, clone it with props
        return React.cloneElement(component, props);
    if (typeof component === 'function') {
        // If it's a component or render function
        const Component = component;
        return React.createElement(Component, props);
    }
    // If it's neither, return it as-is
    return component;
}
export function isSameDay(currentMessage, diffMessage) {
    if (!diffMessage || !diffMessage.createdAt)
        return false;
    const currentCreatedAt = dayjs(currentMessage.createdAt);
    const diffCreatedAt = dayjs(diffMessage.createdAt);
    if (!currentCreatedAt.isValid() || !diffCreatedAt.isValid())
        return false;
    return currentCreatedAt.isSame(diffCreatedAt, 'day');
}
export function isSameUser(currentMessage, diffMessage) {
    return !!(diffMessage &&
        diffMessage.user &&
        currentMessage.user &&
        diffMessage.user._id === currentMessage.user._id);
}
function processCallbackArguments(args) {
    const [e, ...rest] = args;
    const { nativeEvent } = e || {};
    let params = [];
    if (e) {
        if (nativeEvent)
            params.push({ nativeEvent });
        else
            params.push(e);
        if (rest)
            params = params.concat(rest);
    }
    return params;
}
export function useCallbackDebounced(callbackFunc, deps = [], time) {
    const timeoutId = useRef(undefined);
    const savedFunc = useCallback((...args) => {
        const params = processCallbackArguments(args);
        if (timeoutId.current)
            clearTimeout(timeoutId.current);
        timeoutId.current = setTimeout(() => {
            callbackFunc(...params);
        }, time);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [callbackFunc, time, ...deps]);
    useEffect(() => {
        return () => {
            if (timeoutId.current)
                clearTimeout(timeoutId.current);
        };
    }, []);
    return savedFunc;
}
export function useCallbackThrottled(callbackFunc, deps = [], time) {
    const lastExecution = useRef(0);
    const timeoutId = useRef(undefined);
    // we use function instead of arrow to access arguments object
    const savedFunc = useCallback((...args) => {
        const params = processCallbackArguments(args);
        const now = Date.now();
        const timeSinceLastExecution = now - lastExecution.current;
        if (timeSinceLastExecution >= time) {
            // Execute immediately if enough time has passed
            lastExecution.current = now;
            callbackFunc(...params);
        }
        else {
            // Schedule execution for the remaining time
            clearTimeout(timeoutId.current);
            timeoutId.current = setTimeout(() => {
                lastExecution.current = Date.now();
                callbackFunc(...params);
            }, time - timeSinceLastExecution);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [callbackFunc, time, ...deps]);
    useEffect(() => {
        return () => {
            clearTimeout(timeoutId.current);
        };
    }, []);
    return savedFunc;
}
//# sourceMappingURL=utils.js.map