/*
 * Copyright (C) 2013, 2016 Apple Inc. All rights reserved.
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
#ifndef ObjCCallbackFunction_h
#define ObjCCallbackFunction_h 

#include <JavaScriptCore/JSBase.h>

#if JSC_OBJC_API_ENABLED

#import <JavaScriptCore/JSCallbackFunction.h>

#if defined(__OBJC__)
JSObjectRef objCCallbackFunctionForMethod(JSContext *, Class, Protocol *, BOOL isInstanceMethod, SEL, const char* types);
JSObjectRef objCCallbackFunctionForBlock(JSContext *, id);
JSObjectRef objCCallbackFunctionForInit(JSContext *, Class, Protocol *, SEL, const char* types);

id tryUnwrapConstructor(JSC::VM*, JSObjectRef);
#endif

namespace JSC {

class ObjCCallbackFunctionImpl;

class ObjCCallbackFunction : public InternalFunction {
    friend struct APICallbackFunction;
public:
    typedef InternalFunction Base;

    template<typename CellType, SubspaceAccess mode>
    static IsoSubspace* subspaceFor(VM& vm)
    {
        return vm.objCCallbackFunctionSpace<mode>();
    }

    static ObjCCallbackFunction* create(VM&, JSGlobalObject*, const String& name, std::unique_ptr<ObjCCallbackFunctionImpl>);
    static void destroy(JSCell*);

    static Structure* createStructure(VM& vm, JSGlobalObject* globalObject, JSValue prototype)
    {
        ASSERT(globalObject);
        return Structure::create(vm, globalObject, prototype, TypeInfo(InternalFunctionType, StructureFlags), info());
    }

    DECLARE_EXPORT_INFO;

    ObjCCallbackFunctionImpl* impl() const { return m_impl.get(); }

protected:
    ObjCCallbackFunction(VM&, Structure*, JSObjectCallAsFunctionCallback, JSObjectCallAsConstructorCallback, std::unique_ptr<ObjCCallbackFunctionImpl>);

private:
    JSObjectCallAsFunctionCallback functionCallback() { return m_functionCallback; }
    JSObjectCallAsConstructorCallback constructCallback() { return m_constructCallback; }

    JSObjectCallAsFunctionCallback m_functionCallback;
    JSObjectCallAsConstructorCallback m_constructCallback;
    std::unique_ptr<ObjCCallbackFunctionImpl> m_impl;
};

} // namespace JSC

#endif

#endif // ObjCCallbackFunction_h 
