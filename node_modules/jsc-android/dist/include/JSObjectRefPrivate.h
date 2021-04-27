/*
 * Copyright (C) 2010 Apple Inc. All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions
 * are met:
 * 1. Redistributions of source code must retain the above copyright
 *    notice, this list of conditions and the following disclaimer.
 * 2. Redistributions in binary form must reproduce the above copyright
 *    notice, this list of conditions and the following disclaimer in the
 *    documentation and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY APPLE INC. AND ITS CONTRIBUTORS ``AS IS''
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO,
 * THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
 * PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL APPLE INC. OR ITS CONTRIBUTORS
 * BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
 * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF
 * THE POSSIBILITY OF SUCH DAMAGE.
 */

#ifndef JSObjectRefPrivate_h
#define JSObjectRefPrivate_h

#include <JavaScriptCore/JSObjectRef.h>

#ifdef __cplusplus
extern "C" {
#endif

/*!
 @function
 @abstract Sets a private property on an object.  This private property cannot be accessed from within JavaScript.
 @param ctx The execution context to use.
 @param object The JSObject whose private property you want to set.
 @param propertyName A JSString containing the property's name.
 @param value A JSValue to use as the property's value.  This may be NULL.
 @result true if object can store private data, otherwise false.
 @discussion This API allows you to store JS values directly an object in a way that will be ensure that they are kept alive without exposing them to JavaScript code and without introducing the reference cycles that may occur when using JSValueProtect.

 The default object class does not allocate storage for private data. Only objects created with a non-NULL JSClass can store private properties.
 */
JS_EXPORT bool JSObjectSetPrivateProperty(JSContextRef ctx, JSObjectRef object, JSStringRef propertyName, JSValueRef value);

/*!
 @function
 @abstract Gets a private property from an object.
 @param ctx The execution context to use.
 @param object The JSObject whose private property you want to get.
 @param propertyName A JSString containing the property's name.
 @result The property's value if object has the property, otherwise NULL.
 */
JS_EXPORT JSValueRef JSObjectGetPrivateProperty(JSContextRef ctx, JSObjectRef object, JSStringRef propertyName);

/*!
 @function
 @abstract Deletes a private property from an object.
 @param ctx The execution context to use.
 @param object The JSObject whose private property you want to delete.
 @param propertyName A JSString containing the property's name.
 @result true if object can store private data, otherwise false.
 @discussion The default object class does not allocate storage for private data. Only objects created with a non-NULL JSClass can store private data.
 */
JS_EXPORT bool JSObjectDeletePrivateProperty(JSContextRef ctx, JSObjectRef object, JSStringRef propertyName);

JS_EXPORT JSObjectRef JSObjectGetProxyTarget(JSObjectRef);

JS_EXPORT JSGlobalContextRef JSObjectGetGlobalContext(JSObjectRef object);

/*!
 @function
 @abstract Creates a JavaScript promise object by invoking the provided executor.
 @param ctx The execution context to use.
 @param resolve A pointer to a JSObjectRef in which to store the resolve function for the new promise. Pass NULL if you do not care to store the resolve callback.
 @param reject A pointer to a JSObjectRef in which to store the reject function for the new promise. Pass NULL if you do not care to store the reject callback.
 @param exception A pointer to a JSValueRef in which to store an exception, if any. Pass NULL if you do not care to store an exception.
 @result A JSObject that is a promise or NULL if an exception occurred.
 */
JS_EXPORT JSObjectRef JSObjectMakeDeferredPromise(JSContextRef ctx, JSObjectRef* resolve, JSObjectRef* reject, JSValueRef* exception) JSC_API_AVAILABLE(macosx(JSC_MAC_TBA), ios(JSC_IOS_TBA));

/*!
 @function
 @abstract Tests whether an object has a given property using a JSValueRef as the property key.
 @param object The JSObject to test.
 @param propertyKey A JSValueRef containing the property key to use when looking up the property.
 @param exception A pointer to a JSValueRef in which to store an exception, if any. Pass NULL if you do not care to store an exception.
 @result true if the object has a property whose name matches propertyKey, otherwise false.
 @discussion This function is the same as performing "propertyKey in object" from JavaScript.
 */
JS_EXPORT bool JSObjectHasPropertyForKey(JSContextRef ctx, JSObjectRef object, JSValueRef propertyKey, JSValueRef* exception) JSC_API_AVAILABLE(macosx(JSC_MAC_TBA), ios(JSC_IOS_TBA));

/*!
 @function
 @abstract Gets a property from an object using a JSValueRef as the property key.
 @param ctx The execution context to use.
 @param object The JSObject whose property you want to get.
 @param propertyKey A JSValueRef containing the property key to use when looking up the property.
 @param exception A pointer to a JSValueRef in which to store an exception, if any. Pass NULL if you do not care to store an exception.
 @result The property's value if object has the property key, otherwise the undefined value.
 @discussion This function is the same as performing "object[propertyKey]" from JavaScript.
 */
JS_EXPORT JSValueRef JSObjectGetPropertyForKey(JSContextRef ctx, JSObjectRef object, JSValueRef propertyKey, JSValueRef* exception) JSC_API_AVAILABLE(macosx(JSC_MAC_TBA), ios(JSC_IOS_TBA));

/*!
 @function
 @abstract Sets a property on an object using a JSValueRef as the property key.
 @param ctx The execution context to use.
 @param object The JSObject whose property you want to set.
 @param propertyKey A JSValueRef containing the property key to use when looking up the property.
 @param value A JSValueRef to use as the property's value.
 @param attributes A logically ORed set of JSPropertyAttributes to give to the property.
 @param exception A pointer to a JSValueRef in which to store an exception, if any. Pass NULL if you do not care to store an exception.
 @discussion This function is the same as performing "object[propertyKey] = value" from JavaScript.
 */
JS_EXPORT void JSObjectSetPropertyForKey(JSContextRef ctx, JSObjectRef object, JSValueRef propertyKey, JSValueRef value, JSPropertyAttributes attributes, JSValueRef* exception) JSC_API_AVAILABLE(macosx(JSC_MAC_TBA), ios(JSC_IOS_TBA));

/*!
 @function
 @abstract Deletes a property from an object using a JSValueRef as the property key.
 @param ctx The execution context to use.
 @param object The JSObject whose property you want to delete.
 @param propertyKey A JSValueRef containing the property key to use when looking up the property.
 @param exception A pointer to a JSValueRef in which to store an exception, if any. Pass NULL if you do not care to store an exception.
 @result true if the delete operation succeeds, otherwise false (for example, if the property has the kJSPropertyAttributeDontDelete attribute set).
 @discussion This function is the same as performing "delete object[propertyKey]" from JavaScript.
 */
JS_EXPORT bool JSObjectDeletePropertyForKey(JSContextRef ctx, JSObjectRef object, JSValueRef propertyKey, JSValueRef* exception) JSC_API_AVAILABLE(macosx(JSC_MAC_TBA), ios(JSC_IOS_TBA));

/*!
 @function
 @abstract            Creates a JavaScript value of the symbol type.
 @param ctx           The execution context to use.
 @param description   A description of the newly created symbol value.
 @result              A unique JSValue of the symbol type, whose description matches the one provided.
 */
JS_EXPORT JSValueRef JSValueMakeSymbol(JSContextRef ctx, JSStringRef description) JSC_API_AVAILABLE(macosx(JSC_MAC_TBA), ios(JSC_IOS_TBA));

/*!
 @function
 @abstract       Tests whether a JavaScript value's type is the symbol type.
 @param ctx      The execution context to use.
 @param value    The JSValue to test.
 @result         true if value's type is the symbol type, otherwise false.
 */
JS_EXPORT bool JSValueIsSymbol(JSContextRef ctx, JSValueRef value) JSC_API_AVAILABLE(macosx(JSC_MAC_TBA), ios(JSC_IOS_TBA));

#ifdef __cplusplus
}
#endif

#endif // JSObjectRefPrivate_h
