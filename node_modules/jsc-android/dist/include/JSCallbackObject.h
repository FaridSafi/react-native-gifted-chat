/*
 * Copyright (C) 2006-2019 Apple Inc. All rights reserved.
 * Copyright (C) 2007 Eric Seidel <eric@webkit.org>
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

#ifndef JSCallbackObject_h
#define JSCallbackObject_h

#include "JSObjectRef.h"
#include "JSValueRef.h"
#include "JSObject.h"

namespace JSC {

struct JSCallbackObjectData {
    WTF_MAKE_FAST_ALLOCATED;
public:
    JSCallbackObjectData(void* privateData, JSClassRef jsClass)
        : privateData(privateData)
        , jsClass(jsClass)
    {
        JSClassRetain(jsClass);
    }
    
    ~JSCallbackObjectData()
    {
        JSClassRelease(jsClass);
    }
    
    JSValue getPrivateProperty(const Identifier& propertyName) const
    {
        if (!m_privateProperties)
            return JSValue();
        return m_privateProperties->getPrivateProperty(propertyName);
    }
    
    void setPrivateProperty(VM& vm, JSCell* owner, const Identifier& propertyName, JSValue value)
    {
        if (!m_privateProperties)
            m_privateProperties = std::make_unique<JSPrivatePropertyMap>();
        m_privateProperties->setPrivateProperty(vm, owner, propertyName, value);
    }
    
    void deletePrivateProperty(const Identifier& propertyName)
    {
        if (!m_privateProperties)
            return;
        m_privateProperties->deletePrivateProperty(propertyName);
    }

    void visitChildren(SlotVisitor& visitor)
    {
        JSPrivatePropertyMap* properties = m_privateProperties.get();
        if (!properties)
            return;
        properties->visitChildren(visitor);
    }

    void* privateData;
    JSClassRef jsClass;
    struct JSPrivatePropertyMap {
        WTF_MAKE_FAST_ALLOCATED;
    public:
        JSValue getPrivateProperty(const Identifier& propertyName) const
        {
            PrivatePropertyMap::const_iterator location = m_propertyMap.find(propertyName.impl());
            if (location == m_propertyMap.end())
                return JSValue();
            return location->value.get();
        }
        
        void setPrivateProperty(VM& vm, JSCell* owner, const Identifier& propertyName, JSValue value)
        {
            LockHolder locker(m_lock);
            WriteBarrier<Unknown> empty;
            m_propertyMap.add(propertyName.impl(), empty).iterator->value.set(vm, owner, value);
        }
        
        void deletePrivateProperty(const Identifier& propertyName)
        {
            LockHolder locker(m_lock);
            m_propertyMap.remove(propertyName.impl());
        }

        void visitChildren(SlotVisitor& visitor)
        {
            LockHolder locker(m_lock);
            for (auto& pair : m_propertyMap) {
                if (pair.value)
                    visitor.append(pair.value);
            }
        }

    private:
        typedef HashMap<RefPtr<UniquedStringImpl>, WriteBarrier<Unknown>, IdentifierRepHash> PrivatePropertyMap;
        PrivatePropertyMap m_propertyMap;
        Lock m_lock;
    };
    std::unique_ptr<JSPrivatePropertyMap> m_privateProperties;
};

    
template <class Parent>
class JSCallbackObject final : public Parent {
protected:
    JSCallbackObject(ExecState*, Structure*, JSClassRef, void* data);
    JSCallbackObject(VM&, JSClassRef, Structure*);

    void finishCreation(ExecState*);
    void finishCreation(VM&);

public:
    typedef Parent Base;
    static const unsigned StructureFlags = Base::StructureFlags | ProhibitsPropertyCaching | OverridesGetOwnPropertySlot | InterceptsGetOwnPropertySlotByIndexEvenWhenLengthIsNotZero | ImplementsHasInstance | OverridesGetPropertyNames | OverridesGetCallData;
    static_assert(!(StructureFlags & ImplementsDefaultHasInstance), "using customHasInstance");

    ~JSCallbackObject();

    static JSCallbackObject* create(ExecState* exec, JSGlobalObject* globalObject, Structure* structure, JSClassRef classRef, void* data)
    {
        VM& vm = exec->vm();
        ASSERT_UNUSED(globalObject, !structure->globalObject() || structure->globalObject() == globalObject);
        JSCallbackObject* callbackObject = new (NotNull, allocateCell<JSCallbackObject>(vm.heap)) JSCallbackObject(exec, structure, classRef, data);
        callbackObject->finishCreation(exec);
        return callbackObject;
    }
    static JSCallbackObject<Parent>* create(VM&, JSClassRef, Structure*);

    static const bool needsDestruction;
    static void destroy(JSCell* cell)
    {
        static_cast<JSCallbackObject*>(cell)->JSCallbackObject::~JSCallbackObject();
    }

    void setPrivate(void* data);
    void* getPrivate();

    // FIXME: We should fix the warnings for extern-template in JSObject template classes: https://bugs.webkit.org/show_bug.cgi?id=161979
    IGNORE_CLANG_WARNINGS_BEGIN("undefined-var-template")
    DECLARE_INFO;
    IGNORE_CLANG_WARNINGS_END

    JSClassRef classRef() const { return m_callbackObjectData->jsClass; }
    bool inherits(JSClassRef) const;

    static Structure* createStructure(VM&, JSGlobalObject*, JSValue);
    
    JSValue getPrivateProperty(const Identifier& propertyName) const
    {
        return m_callbackObjectData->getPrivateProperty(propertyName);
    }
    
    void setPrivateProperty(VM& vm, const Identifier& propertyName, JSValue value)
    {
        m_callbackObjectData->setPrivateProperty(vm, this, propertyName, value);
    }
    
    void deletePrivateProperty(const Identifier& propertyName)
    {
        m_callbackObjectData->deletePrivateProperty(propertyName);
    }

    using Parent::methodTable;

private:
    static String className(const JSObject*, VM&);
    static String toStringName(const JSObject*, ExecState*);

    static JSValue defaultValue(const JSObject*, ExecState*, PreferredPrimitiveType);

    static bool getOwnPropertySlot(JSObject*, ExecState*, PropertyName, PropertySlot&);
    static bool getOwnPropertySlotByIndex(JSObject*, ExecState*, unsigned propertyName, PropertySlot&);
    
    static bool put(JSCell*, ExecState*, PropertyName, JSValue, PutPropertySlot&);
    static bool putByIndex(JSCell*, ExecState*, unsigned, JSValue, bool shouldThrow);

    static bool deleteProperty(JSCell*, ExecState*, PropertyName);
    static bool deletePropertyByIndex(JSCell*, ExecState*, unsigned);

    static bool customHasInstance(JSObject*, ExecState*, JSValue);

    static void getOwnNonIndexPropertyNames(JSObject*, ExecState*, PropertyNameArray&, EnumerationMode);

    static ConstructType getConstructData(JSCell*, ConstructData&);
    static CallType getCallData(JSCell*, CallData&);

    static void visitChildren(JSCell* cell, SlotVisitor& visitor)
    {
        JSCallbackObject* thisObject = jsCast<JSCallbackObject*>(cell);
        ASSERT_GC_OBJECT_INHERITS((static_cast<Parent*>(thisObject)), JSCallbackObject<Parent>::info());
        Parent::visitChildren(thisObject, visitor);
        thisObject->m_callbackObjectData->visitChildren(visitor);
    }

    void init(ExecState*);
 
    static JSCallbackObject* asCallbackObject(JSValue);
    static JSCallbackObject* asCallbackObject(EncodedJSValue);
 
    static EncodedJSValue JSC_HOST_CALL call(ExecState*);
    static EncodedJSValue JSC_HOST_CALL construct(ExecState*);
   
    JSValue getStaticValue(ExecState*, PropertyName);
    static EncodedJSValue staticFunctionGetter(ExecState*, EncodedJSValue, PropertyName);
    static EncodedJSValue callbackGetter(ExecState*, EncodedJSValue, PropertyName);

    std::unique_ptr<JSCallbackObjectData> m_callbackObjectData;
    const ClassInfo* m_classInfo { nullptr };
};

} // namespace JSC

// include the actual template class implementation
#include "JSCallbackObjectFunctions.h"

#endif // JSCallbackObject_h
