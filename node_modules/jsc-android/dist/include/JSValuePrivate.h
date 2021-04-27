/*
 * Copyright (C) 2018 Apple Inc. All rights reserved.
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
 * THIS SOFTWARE IS PROVIDED BY APPLE INC. ``AS IS'' AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
 * PURPOSE ARE DISCLAIMED.  IN NO EVENT SHALL APPLE INC. OR
 * CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 * EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
 * PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
 * PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY
 * OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

#if JSC_OBJC_API_ENABLED

#import <JavaScriptCore/JavaScriptCore.h>

@interface JSValue(JSPrivate)

#if (defined(__MAC_OS_X_VERSION_MIN_REQUIRED) && __MAC_OS_X_VERSION_MIN_REQUIRED < JSC_MAC_VERSION_TBA) || (defined(__IPHONE_OS_VERSION_MIN_REQUIRED) && __IPHONE_OS_VERSION_MIN_REQUIRED < JSC_IOS_VERSION_TBA)
typedef NSString *JSValueProperty;
#else
typedef id JSValueProperty;
#endif

/*!
 @method
 @abstract Create a new, unique, symbol object.
 @param description The description of the symbol object being created.
 @param context The JSContext to which the resulting JSValue belongs.
 @result The JSValue representing a unique JavaScript value with type symbol.
 */
+ (JSValue *)valueWithNewSymbolFromDescription:(NSString *)description inContext:(JSContext *)context JSC_API_AVAILABLE(macosx(JSC_MAC_TBA), ios(JSC_IOS_TBA));

/*!
 @method
 @abstract Access a property of a JSValue.
 @result The JSValue for the requested property or the JSValue <code>undefined</code>
 if the property does not exist.
 @discussion Corresponds to the JavaScript operation <code>object[property]</code>. After macOS TBA and iOS TBA, 'property' can be any 'id' and will be converted to a JSValue using the conversion rules of <code>valueWithObject:inContext:</code>. Prior to macOS TBA and iOS TBA, 'property' was expected to be an NSString *.
 */
- (JSValue *)valueForProperty:(JSValueProperty)property;

/*!
 @method
 @abstract Set a property on a JSValue.
 @discussion Corresponds to the JavaScript operation <code>object[property] = value</code>. After macOS TBA and iOS TBA, 'property' can be any 'id' and will be converted to a JSValue using the conversion rules of <code>valueWithObject:inContext:</code>. Prior to macOS TBA and iOS TBA, 'property' was expected to be an NSString *.
 */
- (void)setValue:(id)value forProperty:(JSValueProperty)property;

/*!
 @method
 @abstract Delete a property from a JSValue.
 @result YES if deletion is successful, NO otherwise.
 @discussion Corresponds to the JavaScript operation <code>delete object[property]</code>. After macOS TBA and iOS TBA, 'property' can be any 'id' and will be converted to a JSValue using the conversion rules of <code>valueWithObject:inContext:</code>. Prior to macOS TBA and iOS TBA, 'property' was expected to be an NSString *.
 */
- (BOOL)deleteProperty:(JSValueProperty)property;

/*!
 @method
 @abstract Check if a JSValue has a property.
 @discussion This method has the same function as the JavaScript operator <code>in</code>.
 @result Returns YES if property is present on the value.
 @discussion Corresponds to the JavaScript operation <code>property in object</code>. After macOS TBA and iOS TBA, 'property' can be any 'id' and will be converted to a JSValue using the conversion rules of <code>valueWithObject:inContext:</code>. Prior to macOS TBA and iOS TBA, 'property' was expected to be an NSString *.
 */
- (BOOL)hasProperty:(JSValueProperty)property;

/*!
 @method
 @abstract Define properties with custom descriptors on JSValues.
 @discussion This method may be used to create a data or accessor property on an object.
 This method operates in accordance with the Object.defineProperty method in the JavaScript language. After macOS TBA and iOS TBA, 'property' can be any 'id' and will be converted to a JSValue using the conversion rules of <code>valueWithObject:inContext:</code>. Prior to macOS TBA and iOS TBA, 'property' was expected to be an NSString *.
 */
- (void)defineProperty:(JSValueProperty)property descriptor:(id)descriptor;

/*!
 @property
 @abstract Check if a JSValue is a symbol.
 */
@property (readonly) BOOL isSymbol JSC_API_AVAILABLE(macosx(JSC_MAC_TBA), ios(JSC_IOS_TBA));

/*!
 @method
 @abstract Create a new promise object using the provided executor callback.
 @param callback A callback block invoked while the promise object is
 being initialized. The resolve and reject parameters are functions that
 can be called to notify any pending reactions about the state of the
 new promise object.
 @param context The JSContext to which the resulting JSValue belongs.
 @result The JSValue representing a new promise JavaScript object.
 @discussion This method is equivalent to calling the Promise constructor in JavaScript.
 the resolve and reject callbacks each normally take a single value, which they
 forward to all relevent pending reactions. While inside the executor callback context will act
 as if it were in any other callback, except calleeFunction will be <code>nil</code>. This also means
 means the new promise object may be accessed via <code>[context thisValue]</code>.
 */
+ (JSValue *)valueWithNewPromiseInContext:(JSContext *)context fromExecutor:(void (^)(JSValue *resolve, JSValue *reject))callback JSC_API_AVAILABLE(macosx(JSC_MAC_TBA), ios(JSC_IOS_TBA));

/*!
 @method
 @abstract Create a new resolved promise object with the provided value.
 @param result The result value to be passed to any reactions.
 @param context The JSContext to which the resulting JSValue belongs.
 @result The JSValue representing a new promise JavaScript object.
 @discussion This method is equivalent to calling <code>[JSValue valueWithNewPromiseFromExecutor:^(JSValue *resolve, JSValue *reject) { [resolve callWithArguments:@[result]]; } inContext:context]</code>
 */
+ (JSValue *)valueWithNewPromiseResolvedWithResult:(id)result inContext:(JSContext *)context JSC_API_AVAILABLE(macosx(JSC_MAC_TBA), ios(JSC_IOS_TBA));

/*!
 @method
 @abstract Create a new rejected promise object with the provided value.
 @param reason The result value to be passed to any reactions.
 @param context The JSContext to which the resulting JSValue belongs.
 @result The JSValue representing a new promise JavaScript object.
 @discussion This method is equivalent to calling <code>[JSValue valueWithNewPromiseFromExecutor:^(JSValue *resolve, JSValue *reject) { [reject callWithArguments:@[reason]]; } inContext:context]</code>
 */
+ (JSValue *)valueWithNewPromiseRejectedWithReason:(id)reason inContext:(JSContext *)context JSC_API_AVAILABLE(macosx(JSC_MAC_TBA), ios(JSC_IOS_TBA));

@end

/*!
 @category
 @discussion Instances of JSValue implement the following methods in order to enable
 support for subscript access by key and index, for example:

 @textblock
 JSValue *objectA, *objectB;
 JSValue *v1 = object[@"X"]; // Get value for property "X" from 'object'.
 JSValue *v2 = object[42];   // Get value for index 42 from 'object'.
 object[@"Y"] = v1;          // Assign 'v1' to property "Y" of 'object'.
 object[101] = v2;           // Assign 'v2' to index 101 of 'object'.
 @/textblock

 An object key passed as a subscript will be converted to a JavaScript value,
 and then the value using the same rules as <code>valueWithObject:inContext:</code>. In macOS
 TBA and iOS TBA and below, the <code>key</code> argument of
 <code>setObject:object forKeyedSubscript:key</code> was restricted to an
 <code>NSString <NSCopying> *</code> but that restriction was never used.
 */
@interface JSValue (SubscriptSupportPrivate)

- (JSValue *)objectForKeyedSubscript:(JSValueProperty)key;
- (JSValue *)objectAtIndexedSubscript:(NSUInteger)index;
- (void)setObject:(id)object forKeyedSubscript:(JSValueProperty)key;
- (void)setObject:(id)object atIndexedSubscript:(NSUInteger)index;

@end

#endif // JSC_OBJC_API_ENABLED
