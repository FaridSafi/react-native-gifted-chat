/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the LICENSE
 * file in the root directory of this source tree.
 */
#ifndef HERMES_TRACINGRUNTIME_H
#define HERMES_TRACINGRUNTIME_H

#include "SynthTrace.h"

#include <hermes/hermes.h>
#include <jsi/decorator.h>

namespace facebook {
namespace hermes {
namespace tracing {

class TracingRuntime : public jsi::RuntimeDecorator<jsi::Runtime> {
 public:
  using RD = RuntimeDecorator<jsi::Runtime>;

  TracingRuntime(std::unique_ptr<jsi::Runtime> runtime, uint64_t globalID);

  virtual SynthTrace::ObjectID getUniqueID(const jsi::Object &o) = 0;

  virtual void writeTrace(llvm::raw_ostream &os) const = 0;

  /// @name jsi::Runtime methods.
  /// @{

  jsi::Value evaluateJavaScript(
      const std::shared_ptr<const jsi::Buffer> &buffer,
      const std::string &sourceURL) override;

  jsi::Object createObject() override;
  jsi::Object createObject(std::shared_ptr<jsi::HostObject> ho) override;

  jsi::Value getProperty(const jsi::Object &obj, const jsi::String &name)
      override;
  jsi::Value getProperty(const jsi::Object &obj, const jsi::PropNameID &name)
      override;

  bool hasProperty(const jsi::Object &obj, const jsi::String &name) override;
  bool hasProperty(const jsi::Object &obj, const jsi::PropNameID &name)
      override;

  void setPropertyValue(
      jsi::Object &obj,
      const jsi::String &name,
      const jsi::Value &value) override;
  void setPropertyValue(
      jsi::Object &obj,
      const jsi::PropNameID &name,
      const jsi::Value &value) override;

  jsi::Array getPropertyNames(const jsi::Object &o) override;

  jsi::WeakObject createWeakObject(const jsi::Object &o) override;

  jsi::Value lockWeakObject(const jsi::WeakObject &wo) override;

  jsi::Array createArray(size_t length) override;

  size_t size(const jsi::Array &arr) override;
  size_t size(const jsi::ArrayBuffer &buf) override;

  uint8_t *data(const jsi::ArrayBuffer &buf) override;

  jsi::Value getValueAtIndex(const jsi::Array &arr, size_t i) override;

  void setValueAtIndexImpl(jsi::Array &arr, size_t i, const jsi::Value &value)
      override;

  jsi::Function createFunctionFromHostFunction(
      const jsi::PropNameID &name,
      unsigned int paramCount,
      jsi::HostFunctionType func) override;

  jsi::Value call(
      const jsi::Function &func,
      const jsi::Value &jsThis,
      const jsi::Value *args,
      size_t count) override;

  jsi::Value callAsConstructor(
      const jsi::Function &func,
      const jsi::Value *args,
      size_t count) override;

  /// @}

  void addMarker(const std::string &marker);

  SynthTrace &trace() {
    return trace_;
  }

  const SynthTrace &trace() const {
    return trace_;
  }

 private:
  SynthTrace::TraceValue toTraceValue(const jsi::Value &value);

  std::vector<SynthTrace::TraceValue> argStringifyer(
      const jsi::Value *args,
      size_t count);

  SynthTrace::TimeSinceStart getTimeSinceStart() const;

  std::unique_ptr<jsi::Runtime> runtime_;
  SynthTrace trace_;
  const SynthTrace::TimePoint startTime_{std::chrono::steady_clock::now()};
};

// TracingRuntime is *almost* vm independent.  This provides the
// vm-specific bits.  And, it's not a HermesRuntime, but it holds one.
class TracingHermesRuntime final : public TracingRuntime {
 public:
  TracingHermesRuntime(
      std::unique_ptr<HermesRuntime> runtime,
      const ::hermes::vm::RuntimeConfig &runtimeConfig);

  SynthTrace::ObjectID getUniqueID(const jsi::Object &o) override {
    return static_cast<SynthTrace::ObjectID>(hermesRuntime().getUniqueID(o));
  }

  void writeTrace(llvm::raw_ostream &os) const override;

  void writeBridgeTrafficTraceToFile(
      const std::string &fileName) const override;

  jsi::Value evaluateJavaScript(
      const std::shared_ptr<const jsi::Buffer> &buffer,
      const std::string &sourceURL) override;

  HermesRuntime &hermesRuntime() {
    return static_cast<HermesRuntime &>(plain());
  }

  const HermesRuntime &hermesRuntime() const {
    return static_cast<const HermesRuntime &>(plain());
  }

 private:
  // Why do we have a private ctor executed from the public one,
  // instead of just having a single public ctor which calls
  // getUniqueID() to initialize the base class?  This one weird trick
  // is needed to avoid undefined behavior in that case.  Otherwise,
  // when calling the base class ctor, the order of evaluating the
  // globalID value and the side effect of moving the runtime would be
  // unspecified.
  TracingHermesRuntime(
      std::unique_ptr<HermesRuntime> &runtime,
      uint64_t globalID,
      const ::hermes::vm::RuntimeConfig &runtimeConfig);

  const ::hermes::vm::RuntimeConfig conf_;
};

std::unique_ptr<TracingHermesRuntime> makeTracingHermesRuntime(
    std::unique_ptr<HermesRuntime> hermesRuntime,
    const ::hermes::vm::RuntimeConfig &runtimeConfig);

} // namespace tracing
} // namespace hermes
} // namespace facebook

#endif
