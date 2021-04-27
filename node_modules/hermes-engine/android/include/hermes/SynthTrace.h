/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the LICENSE
 * file in the root directory of this source tree.
 */
#ifndef HERMES_SYNTHTRACE_H
#define HERMES_SYNTHTRACE_H

#include "hermes/Public/RuntimeConfig.h"
#include "hermes/Support/JSONEmitter.h"
#include "hermes/Support/StringSetVector.h"
#include "hermes/VM/HermesValue.h"
#include "hermes/VM/MockedEnvironment.h"
#include "hermes/VM/Operations.h"

#include <chrono>
#include <memory>
#include <string>
#include <vector>

namespace llvm {
// Forward declaration to avoid including llvm headers.
class raw_ostream;
} // namespace llvm

namespace facebook {
namespace hermes {
namespace tracing {

/// A SynthTrace is a list of events that occur in a run of a JS file by a
/// runtime that uses JSI.
/// It can be serialized into JSON and written to a llvm::raw_ostream.
class SynthTrace {
 public:
  struct Printable final {
    const SynthTrace &trace;
    /// References to the vectors stored by the Runtime.
    const ::hermes::vm::MockedEnvironment &env;
    const ::hermes::vm::RuntimeConfig &conf;

    Printable(
        const SynthTrace &trace,
        const ::hermes::vm::MockedEnvironment &env,
        const ::hermes::vm::RuntimeConfig &conf)
        : trace(trace), env(env), conf(conf) {}
  };

  using ObjectID = uint64_t;
  /// A tagged union representing different types available in the trace.
  /// HermesValue doesn't have to be used, but it is an efficient way
  /// of encoding a type tag and a value. std::variant is another option.
  /// NOTE: Since HermesValue can only store 64-bit values, strings need to be
  /// changed into a table index.
  using TraceValue = ::hermes::vm::HermesValue;

  /// A TimePoint is a time when some event occurred.
  using TimePoint = std::chrono::steady_clock::time_point;
  using TimeSinceStart = std::chrono::milliseconds;

  static constexpr size_t kHashNumBytes = 20;

  /// RecordType is a tag used to differentiate which type of record it is.
  /// There should be a unique tag for each record type.
  enum class RecordType {
    BeginExecJS,
    EndExecJS,
    Marker,
    CreateObject,
    CreateHostObject,
    CreateHostFunction,
    GetProperty,
    SetProperty,
    HasProperty,
    GetPropertyNames,
    CreateArray,
    ArrayRead,
    ArrayWrite,
    CallFromNative,
    ConstructFromNative,
    ReturnFromNative,
    ReturnToNative,
    CallToNative,
    GetPropertyNative,
    GetPropertyNativeReturn,
    SetPropertyNative,
    SetPropertyNativeReturn,
  };

  /// A Record is one element of a trace.
  struct Record {
    /// The time at which this event occurred with respect to the start of
    /// execution.
    /// NOTE: This is not compared in the \c operator= in order for tests to
    /// pass.
    const TimeSinceStart time_;
    explicit Record() = delete;
    explicit Record(TimeSinceStart time) : time_(time) {}
    virtual ~Record() = default;

    /// Write out a serialization of this Record.
    /// \param json An emitter connected to an ostream which will write out
    ///   JSON.
    void toJSON(::hermes::JSONEmitter &json, const SynthTrace &trace) const;
    virtual RecordType getType() const = 0;

    /// \return A list of object ids that are defined by this record.
    /// Defined means that the record would produce that object as a locally
    /// accessible value if it were executed.
    virtual std::vector<ObjectID> defs() const {
      return {};
    }
    /// \return A list of object ids that are used by this record.
    /// Used means that the record would use that object as a value if it were
    /// executed.
    /// If a record uses an object, then some preceding record (either in the
    /// same function invocation, or somewhere globally) must provide a
    /// definition.
    virtual std::vector<ObjectID> uses() const {
      return {};
    }

   protected:
    /// Compare records for equality. Derived classes should override this, call
    /// their parent, and mark any public versions as "final".
    virtual bool operator==(const Record &that) const {
      return getType() == that.getType();
    }

    /// Emit JSON fields into \p os, excluding the closing curly brace.
    /// NOTE: This is overridable, and non-abstract children should call the
    /// parent.
    virtual void toJSONInternal(
        ::hermes::JSONEmitter &json,
        const SynthTrace &trace) const;
  };

  explicit SynthTrace(ObjectID globalObjID)
      : globalObjID_(globalObjID), sourceHash_() {}

  template <typename T, typename... Args>
  void emplace_back(Args &&... args) {
    records_.emplace_back(new T(std::forward<Args>(args)...));
  }

  const std::vector<std::unique_ptr<Record>> &records() const {
    return records_;
  }

  ObjectID globalObjID() const {
    return globalObjID_;
  }

  const ::hermes::SHA1 &sourceHash() const {
    return sourceHash_;
  }

  void setSourceHash(const ::hermes::SHA1 &sourceHash) {
    sourceHash_ = sourceHash;
  }

  /// Given a trace value, turn it into its typed string.
  std::string encode(TraceValue value) const;
  /// Encode an undefined JS value for the trace.
  static TraceValue encodeUndefined();
  /// Encode a null JS value for the trace.
  static TraceValue encodeNull();
  /// Encode a boolean JS value for the trace.
  static TraceValue encodeBool(bool value);
  /// Encodes a numeric value for the trace.
  static TraceValue encodeNumber(double value);
  /// Encodes an object for the trace as a unique id.
  static TraceValue encodeObject(ObjectID objID);
  /// Encodes a string for the trace. Adds it to the string table if it hasn't
  /// been seen before.
  TraceValue encodeString(const std::string &value);

  /// Decodes a string into a trace value. It can add to the string table.
  TraceValue decode(const std::string &);
  /// Extracts an object ID from a trace value.
  /// \pre The value must be an object.
  static ObjectID decodeObject(TraceValue value);
  /// Extracts a string from a trace value.
  /// \pre The value must be a string.
  const std::string &decodeString(TraceValue value) const;

  static bool equal(TraceValue x, TraceValue y) {
    // We are encoding random numbers into strings, and can't use the library
    // functions.
    // For now, ignore differences that result from NaN, +0/-0.
    return x.getRaw() == y.getRaw();
  }

  /// The version of the Synth Benchmark
  constexpr static uint32_t synthVersion() {
    return 2;
  }

 private:
  std::vector<std::unique_ptr<Record>> records_;
  /// The id of the global object.
  const ObjectID globalObjID_;
  /// A hash of the source that was executed in this trace.
  ::hermes::SHA1 sourceHash_;
  /// A table of strings to avoid repeated strings taking up memory. Similar to
  /// the IdentifierTable, except it doesn't need to be collected (it stores
  /// strings forever).
  /// Strings are stored in the trace objects as an index into this table.
  ::hermes::StringSetVector stringTable_;

 public:
  /// @name Record classes
  /// @{

  /// A MarkerRecord is an event that simply records an interesting event that
  /// is not necessarily meaningful to the interpreter. It comes with a tag that
  /// says what type of marker it was.
  struct MarkerRecord : public Record {
    static constexpr RecordType type{RecordType::Marker};
    const std::string tag_;
    explicit MarkerRecord(TimeSinceStart time, const std::string &tag)
        : Record(time), tag_(tag) {}
    RecordType getType() const override {
      return type;
    }

   protected:
    void toJSONInternal(::hermes::JSONEmitter &json, const SynthTrace &trace)
        const override;
    bool operator==(const Record &that) const override;
  };

  /// A BeginExecJSRecord is an event where execution begins of JS source
  /// code. This is not necessarily the first record, since native code can
  /// inject values into the VM before any source code is run.
  struct BeginExecJSRecord final : public Record {
    static constexpr RecordType type{RecordType::BeginExecJS};
    using Record::Record;
    RecordType getType() const override {
      return type;
    }
  };

  struct ReturnMixin {
    const TraceValue retVal_;

    explicit ReturnMixin(TraceValue value) : retVal_(value) {}

    void toJSONInternal(::hermes::JSONEmitter &json, const SynthTrace &trace)
        const;
    bool operator==(const ReturnMixin &that) const;
  };

  /// A EndExecJSRecord is an event where execution of JS source code stops.
  /// This does not mean that the source code will never be entered again, just
  /// that it has an entered a phase where it is waiting for native code to call
  /// into the JS. This event is not guaranteed to be the last event, for the
  /// aforementioned reason. The logged retVal is the result of the evaluation
  /// ("undefined" in the majority of cases).
  struct EndExecJSRecord final : public MarkerRecord, public ReturnMixin {
    static constexpr RecordType type{RecordType::EndExecJS};
    EndExecJSRecord(TimeSinceStart time, TraceValue retVal)
        : MarkerRecord(time, "end_global_code"), ReturnMixin(retVal) {}

    RecordType getType() const override {
      return type;
    }
    bool operator==(const Record &that) const final;
    virtual void toJSONInternal(
        ::hermes::JSONEmitter &json,
        const SynthTrace &trace) const final;
    std::vector<ObjectID> defs() const override {
      auto defs = MarkerRecord::defs();
      if (retVal_.isObject()) {
        defs.push_back(decodeObject(retVal_));
      }
      return defs;
    }
  };

  /// A CreateObjectRecord is an event where an empty object is created by the
  /// native code.
  struct CreateObjectRecord : public Record {
    static constexpr RecordType type{RecordType::CreateObject};
    const ObjectID objID_;

    explicit CreateObjectRecord(TimeSinceStart time, ObjectID objID)
        : Record(time), objID_(objID) {}

    bool operator==(const Record &that) const final;

    void toJSONInternal(::hermes::JSONEmitter &json, const SynthTrace &trace)
        const override;
    RecordType getType() const override {
      return type;
    }

    std::vector<ObjectID> defs() const override {
      return {objID_};
    }

    std::vector<ObjectID> uses() const override {
      return {};
    }
  };

  struct CreateHostObjectRecord final : public CreateObjectRecord {
    static constexpr RecordType type{RecordType::CreateHostObject};
    using CreateObjectRecord::CreateObjectRecord;
    RecordType getType() const override {
      return type;
    }
  };

  struct CreateHostFunctionRecord final : public CreateObjectRecord {
    static constexpr RecordType type{RecordType::CreateHostFunction};
    using CreateObjectRecord::CreateObjectRecord;
    RecordType getType() const override {
      return type;
    }
  };

  struct GetOrSetPropertyRecord : public Record {
    const ObjectID objID_;
    const std::string propName_;
    const TraceValue value_;

    explicit GetOrSetPropertyRecord(
        TimeSinceStart time,
        ObjectID objID,
        const std::string &propName,
        TraceValue value)
        : Record(time), objID_(objID), propName_(propName), value_(value) {}

    bool operator==(const Record &that) const final;

    std::vector<ObjectID> uses() const override {
      return {objID_};
    }

    void toJSONInternal(::hermes::JSONEmitter &json, const SynthTrace &trace)
        const override;
  };

  /// A GetPropertyRecord is an event where native code accesses the property
  /// of a JS object.
  struct GetPropertyRecord : public GetOrSetPropertyRecord {
    static constexpr RecordType type{RecordType::GetProperty};
    using GetOrSetPropertyRecord::GetOrSetPropertyRecord;
    RecordType getType() const override {
      return type;
    }
    std::vector<ObjectID> defs() const override {
      auto defs = GetOrSetPropertyRecord::defs();
      if (value_.isObject()) {
        defs.push_back(decodeObject(value_));
      }
      return defs;
    }
  };

  /// A SetPropertyRecord is an event where native code writes to the property
  /// of a JS object.
  struct SetPropertyRecord : public GetOrSetPropertyRecord {
    static constexpr RecordType type{RecordType::SetProperty};
    using GetOrSetPropertyRecord::GetOrSetPropertyRecord;
    RecordType getType() const override {
      return type;
    }
    std::vector<ObjectID> uses() const override {
      auto uses = GetOrSetPropertyRecord::uses();
      if (value_.isObject()) {
        uses.push_back(decodeObject(value_));
      }
      return uses;
    }
  };

  /// A HasPropertyRecord is an event where native code queries is a property
  /// exists on an object.
  struct HasPropertyRecord final : public Record {
    static constexpr RecordType type{RecordType::HasProperty};
    const ObjectID objID_;
    const std::string propName_;

    explicit HasPropertyRecord(
        TimeSinceStart time,
        ObjectID objID,
        const std::string &propName)
        : Record(time), objID_(objID), propName_(propName) {}

    bool operator==(const Record &that) const final;

    void toJSONInternal(::hermes::JSONEmitter &json, const SynthTrace &trace)
        const override;
    RecordType getType() const override {
      return type;
    }
    std::vector<ObjectID> uses() const override {
      return {objID_};
    }
  };

  struct GetPropertyNamesRecord final : public Record {
    static constexpr RecordType type{RecordType::GetPropertyNames};
    const ObjectID objID_;
    // Since getPropertyNames always returns an array, this can be an object id
    // rather than a TraceValue.
    const ObjectID propNamesID_;

    explicit GetPropertyNamesRecord(
        TimeSinceStart time,
        ObjectID objID,
        ObjectID propNamesID)
        : Record(time), objID_(objID), propNamesID_(propNamesID) {}

    bool operator==(const Record &that) const final;

    void toJSONInternal(::hermes::JSONEmitter &json, const SynthTrace &trace)
        const override;
    RecordType getType() const override {
      return type;
    }
    std::vector<ObjectID> defs() const override {
      return {propNamesID_};
    }
    std::vector<ObjectID> uses() const override {
      return {objID_};
    }
  };

  /// A CreateArrayRecord is an event where a new array is created of a specific
  /// length.
  struct CreateArrayRecord final : public Record {
    static constexpr RecordType type{RecordType::CreateArray};
    const ObjectID objID_;
    const size_t length_;

    explicit CreateArrayRecord(
        TimeSinceStart time,
        ObjectID objID,
        size_t length)
        : Record(time), objID_(objID), length_(length) {}

    bool operator==(const Record &that) const final;

    void toJSONInternal(::hermes::JSONEmitter &json, const SynthTrace &trace)
        const override;
    RecordType getType() const override {
      return type;
    }
    std::vector<ObjectID> defs() const override {
      return {objID_};
    }
  };

  struct ArrayReadOrWriteRecord : public Record {
    const ObjectID objID_;
    const size_t index_;
    const TraceValue value_;

    explicit ArrayReadOrWriteRecord(
        TimeSinceStart time,
        ObjectID objID,
        size_t index,
        TraceValue value)
        : Record(time), objID_(objID), index_(index), value_(value) {}

    bool operator==(const Record &that) const final;

    void toJSONInternal(::hermes::JSONEmitter &json, const SynthTrace &trace)
        const override;
    std::vector<ObjectID> uses() const override {
      return {objID_};
    }
  };

  /// An ArrayReadRecord is an event where a value was read from an index
  /// of an array.
  /// It is modeled separately from GetProperty because it is more efficient to
  /// read from a numeric index on an array than a string.
  struct ArrayReadRecord final : public ArrayReadOrWriteRecord {
    static constexpr RecordType type{RecordType::ArrayRead};
    using ArrayReadOrWriteRecord::ArrayReadOrWriteRecord;
    RecordType getType() const override {
      return type;
    }
    std::vector<ObjectID> defs() const override {
      auto defs = ArrayReadOrWriteRecord::defs();
      if (value_.isObject()) {
        defs.push_back(decodeObject(value_));
      }
      return defs;
    }
  };

  /// An ArrayWriteRecord is an event where a value was written into an index
  /// of an array.
  struct ArrayWriteRecord final : public ArrayReadOrWriteRecord {
    static constexpr RecordType type{RecordType::ArrayWrite};
    using ArrayReadOrWriteRecord::ArrayReadOrWriteRecord;
    RecordType getType() const override {
      return type;
    }
    std::vector<ObjectID> uses() const override {
      auto uses = ArrayReadOrWriteRecord::uses();
      if (value_.isObject()) {
        uses.push_back(decodeObject(value_));
      }
      return uses;
    }
  };

  struct CallRecord : public Record {
    /// The functionID_ is the id of the function JS object that is called from
    /// JS.
    const ObjectID functionID_;
    const TraceValue thisArg_;
    /// The arguments given to a call (excluding the this parameter),
    /// already JSON stringified.
    const std::vector<TraceValue> args_;

    explicit CallRecord(
        TimeSinceStart time,
        ObjectID functionID,
        TraceValue thisArg,
        const std::vector<TraceValue> &args)
        : Record(time),
          functionID_(functionID),
          thisArg_(thisArg),
          args_(args) {}

    bool operator==(const Record &that) const final;

    void toJSONInternal(::hermes::JSONEmitter &json, const SynthTrace &trace)
        const override;
    std::vector<ObjectID> uses() const override {
      // The function is used regardless of direction.
      return {functionID_};
    }

   protected:
    std::vector<ObjectID> getArgObjects() const {
      std::vector<ObjectID> objs;
      if (thisArg_.isObject()) {
        objs.push_back(decodeObject(thisArg_));
      }
      for (const auto &arg : args_) {
        if (arg.isObject()) {
          objs.push_back(decodeObject(arg));
        }
      }
      return objs;
    }
  };

  /// A CallFromNativeRecord is an event where native code calls into a JS
  /// function.
  struct CallFromNativeRecord : public CallRecord {
    static constexpr RecordType type{RecordType::CallFromNative};
    using CallRecord::CallRecord;
    RecordType getType() const override {
      return type;
    }
    std::vector<ObjectID> uses() const override {
      auto uses = CallRecord::uses();
      auto objs = CallRecord::getArgObjects();
      uses.insert(uses.end(), objs.begin(), objs.end());
      return uses;
    }
  };

  /// A ConstructFromNativeRecord is the same as \c CallFromNativeRecord, except
  /// the function is called with the new operator.
  struct ConstructFromNativeRecord final : public CallFromNativeRecord {
    static constexpr RecordType type{RecordType::ConstructFromNative};
    using CallFromNativeRecord::CallFromNativeRecord;
    RecordType getType() const override {
      return type;
    }
  };

  /// A ReturnFromNativeRecord is an event where a native function returns to a
  /// JS caller.
  /// It pairs with \c CallToNativeRecord.
  struct ReturnFromNativeRecord final : public Record, public ReturnMixin {
    static constexpr RecordType type{RecordType::ReturnFromNative};
    ReturnFromNativeRecord(TimeSinceStart time, TraceValue retVal)
        : Record(time), ReturnMixin(retVal) {}
    RecordType getType() const override {
      return type;
    }
    std::vector<ObjectID> uses() const override {
      auto uses = Record::uses();
      if (retVal_.isObject()) {
        uses.push_back(decodeObject(retVal_));
      }
      return uses;
    }
    bool operator==(const Record &that) const final;
    void toJSONInternal(::hermes::JSONEmitter &json, const SynthTrace &trace)
        const override;
  };

  /// A ReturnToNativeRecord is an event where a JS function returns to a native
  /// caller.
  /// It pairs with \c CallFromNativeRecord.
  struct ReturnToNativeRecord final : public Record, public ReturnMixin {
    static constexpr RecordType type{RecordType::ReturnToNative};
    ReturnToNativeRecord(TimeSinceStart time, TraceValue retVal)
        : Record(time), ReturnMixin(retVal) {}
    RecordType getType() const override {
      return type;
    }
    std::vector<ObjectID> defs() const override {
      auto defs = Record::defs();
      if (retVal_.isObject()) {
        defs.push_back(decodeObject(retVal_));
      }
      return defs;
    }
    bool operator==(const Record &that) const final;
    void toJSONInternal(::hermes::JSONEmitter &json, const SynthTrace &trace)
        const override;
  };

  /// A CallToNativeRecord is an event where JS code calls into a natively
  /// defined function.
  struct CallToNativeRecord final : public CallRecord {
    static constexpr RecordType type{RecordType::CallToNative};
    using CallRecord::CallRecord;
    RecordType getType() const override {
      return type;
    }
    std::vector<ObjectID> defs() const override {
      auto defs = CallRecord::defs();
      auto objs = CallRecord::getArgObjects();
      defs.insert(defs.end(), objs.begin(), objs.end());
      return defs;
    }
  };

  struct GetOrSetPropertyNativeRecord : public Record {
    const ObjectID hostObjectID_;
    const std::string propName_;

    explicit GetOrSetPropertyNativeRecord(
        TimeSinceStart time,
        ObjectID hostObjectID,
        std::string propName)
        : Record(time), hostObjectID_(hostObjectID), propName_(propName) {}

    void toJSONInternal(::hermes::JSONEmitter &json, const SynthTrace &trace)
        const override;
    std::vector<ObjectID> uses() const override {
      return {hostObjectID_};
    }

   protected:
    bool operator==(const Record &that) const override;
  };

  /// A GetPropertyNativeRecord is an event where JS tries to access a property
  /// on a native object.
  /// This needs to be modeled as a call with no arguments, since native code
  /// can arbitrarily affect the JS heap during the accessor.
  struct GetPropertyNativeRecord final : public GetOrSetPropertyNativeRecord {
    static constexpr RecordType type{RecordType::GetPropertyNative};
    using GetOrSetPropertyNativeRecord::GetOrSetPropertyNativeRecord;
    RecordType getType() const override {
      return type;
    }
    bool operator==(const Record &that) const final;
  };

  struct GetPropertyNativeReturnRecord final : public Record,
                                               public ReturnMixin {
    static constexpr RecordType type{RecordType::GetPropertyNativeReturn};
    GetPropertyNativeReturnRecord(TimeSinceStart time, TraceValue retVal)
        : Record(time), ReturnMixin(retVal) {}
    RecordType getType() const override {
      return type;
    }
    std::vector<ObjectID> uses() const override {
      auto uses = Record::uses();
      if (retVal_.isObject()) {
        uses.push_back(decodeObject(retVal_));
      }
      return uses;
    }
    bool operator==(const Record &that) const final;

   protected:
    void toJSONInternal(::hermes::JSONEmitter &json, const SynthTrace &trace)
        const override;
  };

  /// A SetPropertyNativeRecord is an event where JS code writes to the property
  /// of a Native object.
  /// This needs to be modeled as a call with one argument, since native code
  /// can arbitrarily affect the JS heap during the accessor.
  struct SetPropertyNativeRecord final : public GetOrSetPropertyNativeRecord {
    static constexpr RecordType type{RecordType::SetPropertyNative};
    TraceValue value_;
    explicit SetPropertyNativeRecord(
        TimeSinceStart time,
        ObjectID hostObjectID,
        std::string propName,
        TraceValue value)
        : GetOrSetPropertyNativeRecord(time, hostObjectID, propName),
          value_(value) {}
    bool operator==(const Record &that) const final;
    void toJSONInternal(::hermes::JSONEmitter &json, const SynthTrace &trace)
        const override;
    RecordType getType() const override {
      return type;
    }
    std::vector<ObjectID> defs() const override {
      auto defs = GetOrSetPropertyNativeRecord::defs();
      if (value_.isObject()) {
        defs.push_back(decodeObject(value_));
      }
      return defs;
    }
  };

  /// A SetPropertyNativeReturnRecord needs to record no extra information
  struct SetPropertyNativeReturnRecord final : public Record {
    static constexpr RecordType type{RecordType::SetPropertyNativeReturn};
    using Record::Record;
    RecordType getType() const override {
      return type;
    }
    bool operator==(const Record &that) const final {
      // Since there are no fields to compare, any two will always be the same.
      return Record::operator==(that);
    }
  };

  /// @}
  friend llvm::raw_ostream &operator<<(
      llvm::raw_ostream &os,
      const SynthTrace::Printable &trace);
};

llvm::raw_ostream &operator<<(
    llvm::raw_ostream &os,
    const SynthTrace::Printable &trace);
llvm::raw_ostream &operator<<(
    llvm::raw_ostream &os,
    SynthTrace::RecordType type);
std::istream &operator>>(std::istream &is, SynthTrace::RecordType &type);

} // namespace tracing
} // namespace hermes
} // namespace facebook

#endif
