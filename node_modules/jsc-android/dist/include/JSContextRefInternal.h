/*
 * Copyright (C) 2014 Apple Inc.  All rights reserved.
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

#ifndef JSContextRefInternal_h
#define JSContextRefInternal_h

#include "JSContextRefPrivate.h"

#if USE(CF)
#include <CoreFoundation/CFRunLoop.h>
#endif

#ifdef __cplusplus
extern "C" {
#endif

#if USE(CF)
/*!
@function
@abstract Gets the run loop used by the Web Inspector debugger when evaluating JavaScript in this context.
@param ctx The JSGlobalContext whose setting you want to get.
*/
JS_EXPORT CFRunLoopRef JSGlobalContextGetDebuggerRunLoop(JSGlobalContextRef ctx) JSC_API_AVAILABLE(macosx(10.10), ios(8.0));

/*!
@function
@abstract Sets the run loop used by the Web Inspector debugger when evaluating JavaScript in this context.
@param ctx The JSGlobalContext that you want to change.
@param runLoop The new value of the setting for the context.
*/
JS_EXPORT void JSGlobalContextSetDebuggerRunLoop(JSGlobalContextRef ctx, CFRunLoopRef runLoop) JSC_API_AVAILABLE(macosx(10.10), ios(8.0));
#endif

#ifdef __cplusplus
}
#endif

#endif // JSContextRefInternal_h
