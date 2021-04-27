/*
 * Copyright (C) 2016 Apple Inc. All rights reserved.
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

#ifndef APIUtils_h
#define APIUtils_h

#include "CatchScope.h"
#include "Exception.h"
#include "JSCJSValue.h"
#include "JSGlobalObjectInspectorController.h"
#include "JSValueRef.h"

enum class ExceptionStatus {
    DidThrow,
    DidNotThrow
};

inline ExceptionStatus handleExceptionIfNeeded(JSC::CatchScope& scope, JSC::ExecState* exec, JSValueRef* returnedExceptionRef)
{
    if (UNLIKELY(scope.exception())) {
        JSC::Exception* exception = scope.exception();
        if (returnedExceptionRef)
            *returnedExceptionRef = toRef(exec, exception->value());
        scope.clearException();
#if ENABLE(REMOTE_INSPECTOR)
        scope.vm().vmEntryGlobalObject(exec)->inspectorController().reportAPIException(exec, exception);
#endif
        return ExceptionStatus::DidThrow;
    }
    return ExceptionStatus::DidNotThrow;
}

inline void setException(JSC::ExecState* exec, JSValueRef* returnedExceptionRef, JSC::JSValue exception)
{
    if (returnedExceptionRef)
        *returnedExceptionRef = toRef(exec, exception);
#if ENABLE(REMOTE_INSPECTOR)
    JSC::VM& vm = exec->vm();
    vm.vmEntryGlobalObject(exec)->inspectorController().reportAPIException(exec, JSC::Exception::create(vm, exception));
#endif
}

#endif /* APIUtils_h */
