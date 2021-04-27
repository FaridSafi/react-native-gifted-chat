/*
 *  Copyright (C) 1999-2001 Harri Porten (porten@kde.org)
 *  Copyright (C) 2001 Peter Kelly (pmk@post.com)
 *  Copyright (C) 2003-2019 Apple Inc. All rights reserved.
 *
 *  This library is free software; you can redistribute it and/or
 *  modify it under the terms of the GNU Library General Public
 *  License as published by the Free Software Foundation; either
 *  version 2 of the License, or (at your option) any later version.
 *
 *  This library is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 *  Library General Public License for more details.
 *
 *  You should have received a copy of the GNU Library General Public License
 *  along with this library; see the file COPYING.LIB.  If not, write to
 *  the Free Software Foundation, Inc., 51 Franklin Street, Fifth Floor,
 *  Boston, MA 02110-1301, USA.
 *
 */

#pragma once

#include "CallFrame.h"
#include "JSCJSValue.h"
#include "JSCast.h"
#include "Structure.h"

namespace JSC {

class JSAPIValueWrapper final : public JSCell {
    friend JSValue jsAPIValueWrapper(ExecState*, JSValue);
public:
    typedef JSCell Base;
    static const unsigned StructureFlags = Base::StructureFlags | StructureIsImmortal;

    JSValue value() const { return m_value.get(); }

    static Structure* createStructure(VM& vm, JSGlobalObject* globalObject, JSValue prototype)
    {
        return Structure::create(vm, globalObject, prototype, TypeInfo(APIValueWrapperType, OverridesGetPropertyNames), info());
    }

    DECLARE_EXPORT_INFO;

    static JSAPIValueWrapper* create(VM& vm, JSValue value)
    {
        JSAPIValueWrapper* wrapper = new (NotNull, allocateCell<JSAPIValueWrapper>(vm.heap)) JSAPIValueWrapper(vm);
        wrapper->finishCreation(vm, value);
        return wrapper;
    }

protected:
    void finishCreation(VM& vm, JSValue value)
    {
        Base::finishCreation(vm);
        m_value.set(vm, this, value);
        ASSERT(!value.isCell());
    }

private:
    JSAPIValueWrapper(VM& vm)
        : JSCell(vm, vm.apiWrapperStructure.get())
    {
    }

    WriteBarrier<Unknown> m_value;
};

} // namespace JSC
