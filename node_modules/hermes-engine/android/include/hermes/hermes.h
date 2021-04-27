/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the LICENSE
 * file in the root directory of this source tree.
 */
#ifndef HERMES_HERMES_H
#define HERMES_HERMES_H

#include <exception>
#include <list>
#include <memory>
#include <string>

#include <hermes/Public/RuntimeConfig.h>
#include <jsi/jsi.h>

struct HermesTestHelper;

namespace llvm {
class raw_ostream;
}

namespace hermes {
namespace vm {
struct MockedEnvironment;
} // namespace vm
} // namespace hermes

namespace facebook {
namespace jsi {

class ThreadSafeRuntime;

}

namespace hermes {

#ifdef HERMES_ENABLE_DEBUGGER
namespace debugger {
class Debugger;
}
#endif

class HermesRuntimeImpl;

/// Represents a Hermes JS runtime.
class HermesRuntime : public jsi::Runtime {
 public:
  static bool isHermesBytecode(const uint8_t *data, size_t len);
  // (EXPERIMENTAL) Issues madvise calls for portions of the given
  // bytecode file that will likely be used when loading the bytecode
  // file and running its global function.
  static void prefetchHermesBytecode(const uint8_t *data, size_t len);
  // Returns whether the data is valid HBC with more extensive checks than
  // isHermesBytecode and returns why it isn't in errorMessage (if nonnull)
  // if not.
  static bool hermesBytecodeSanityCheck(
      const uint8_t *data,
      size_t len,
      std::string *errorMessage = nullptr);
  static void setFatalHandler(void (*handler)(const std::string &));

  // Assuming that \p data is valid HBC bytecode data, returns a pointer to then
  // first element of the epilogue, data append to the end of the bytecode
  // stream. Return pair contain ptr to data and header.
  static std::pair<const uint8_t *, size_t> getBytecodeEpilogue(
      const uint8_t *data,
      size_t len);

  /// Enable sampling profiler.
  static void enableSamplingProfiler();

  /// Disable the sampling profiler
  static void disableSamplingProfiler();

  /// Dump sampled stack trace to the given file name.
  static void dumpSampledTraceToFile(const std::string &fileName);

  // The base class declares most of the interesting methods.  This
  // just declares new methods which are specific to HermesRuntime.
  // The actual implementations of the pure virtual methods are
  // provided by a class internal to the .cpp file, which is created
  // by the factory.

  /// Load a new segment into the Runtime.
  /// The \param context must be a valid RequireContext retrieved from JS
  /// using `require.context`.
  void loadSegment(
      std::unique_ptr<const jsi::Buffer> buffer,
      const jsi::Value &context);

  /// Gets a guaranteed unique id for an object, which is assigned at
  /// allocation time and is static throughout that object's lifetime.
  uint64_t getUniqueID(const jsi::Object &o) const;

  /// Get a structure representing the enviroment-dependent behavior, so
  /// it can be written into the trace for later replay.
  const ::hermes::vm::MockedEnvironment &getMockedEnvironment() const;

#ifdef HERMESVM_SYNTH_REPLAY
  /// Make the runtime read from \p env to replay its environment-dependent
  /// behavior.
  void setMockedEnvironment(const ::hermes::vm::MockedEnvironment &env);
#endif

#ifdef HERMESVM_PROFILER_BB
  /// Write the trace to the given stream.
  void dumpBasicBlockProfileTrace(llvm::raw_ostream &os) const;
#endif

#ifdef HERMESVM_PROFILER_OPCODE
  /// Write the opcode stats to the given stream.
  void dumpOpcodeStats(llvm::raw_ostream &os) const;
#endif

#ifdef HERMESVM_PROFILER_EXTERN
  /// Dump map of profiler symbols to given file name.
  void dumpProfilerSymbolsToFile(const std::string &fileName) const;
#endif

#ifdef HERMES_ENABLE_DEBUGGER
  /// \return a reference to the Debugger for this Runtime.
  debugger::Debugger &getDebugger();

  struct DebugFlags {
    bool lazy{false};
  };

  /// Evaluate the given code in an unoptimized form,
  /// used for debugging.
  void debugJavaScript(
      const std::string &src,
      const std::string &sourceURL,
      const DebugFlags &debugFlags);
#endif

  /// Register this runtime for sampling profiler.
  void registerForProfiling();
  /// Unregister this runtime for sampling profiler.
  void unregisterForProfiling();

  /// Register this runtime for execution time limit monitoring, with a time
  /// limit of \p timeoutInMs milliseconds.
  /// All JS compiled to bytecode via prepareJS, or evaluateJS, will support the
  /// time limit monitoring.  If JS prepared in other ways is executed, care
  /// must be taken to ensure that it is compiled in a mode that supports the
  /// monitoring (i.e., the emitted code contains async break checks).
  void watchTimeLimit(uint32_t timeoutInMs);
  /// Unregister this runtime for execution time limit monitoring.
  void unwatchTimeLimit();

 private:
  // Only HermesRuntimeImpl can subclass this.
  HermesRuntime() = default;
  friend class HermesRuntimeImpl;

  friend struct ::HermesTestHelper;
  size_t rootsListLength() const;

  // Do not add any members here.  This ensures that there are no
  // object size inconsistencies.  All data should be in the impl
  // class in the .cpp file.
};

std::unique_ptr<HermesRuntime> makeHermesRuntime(
    const ::hermes::vm::RuntimeConfig &runtimeConfig =
        ::hermes::vm::RuntimeConfig());
std::unique_ptr<jsi::ThreadSafeRuntime> makeThreadSafeHermesRuntime(
    const ::hermes::vm::RuntimeConfig &runtimeConfig =
        ::hermes::vm::RuntimeConfig());
} // namespace hermes
} // namespace facebook

#endif
