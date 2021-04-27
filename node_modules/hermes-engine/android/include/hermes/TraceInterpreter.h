/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the LICENSE
 * file in the root directory of this source tree.
 */
#pragma once

#ifndef HERMESVM_SYNTH_REPLAY
#error TraceInterpreter can only be used with synth mode on.
#endif

#include <hermes/Public/RuntimeConfig.h>
#include <hermes/SynthTrace.h>

#include <jsi/jsi.h>
#include <llvm/Support/MemoryBuffer.h>
#include <llvm/Support/raw_ostream.h>

#include <unordered_map>
#include <vector>

namespace facebook {
namespace hermes {

namespace tracing {

class TraceInterpreter final {
 public:
  /// A DefAndUse details the location of a definition of an object id, and its
  /// use. It is an index into the global record table.
  struct DefAndUse {
    /// If an object was not used or not defined, its DefAndUse can store this
    /// value.
    static constexpr uint64_t kUnused = std::numeric_limits<uint64_t>::max();

    uint64_t lastDefBeforeFirstUse{kUnused};
    uint64_t lastUse{kUnused};
  };

  /// A Call is a list of Pieces that represent the entire single call
  /// frame, even if it spans multiple control transfers between JS and native.
  /// It also contains a map from ObjectIDs to their last definition before a
  /// first use, and a last use.
  struct Call {
    /// A Piece is a series of contiguous records that are part of the same
    /// native call, and have no transitions to JS in the middle of them.
    struct Piece {
      /// The index of the start of the piece in the global record vector.
      uint64_t start;
      std::vector<const SynthTrace::Record *> records;

      explicit Piece() : start(0) {}
      explicit Piece(int64_t start) : start(start) {}
    };

    /// A list of pieces, where each piece stops when a transition occurs
    /// between JS and Native. Pieces are guaranteed to be sorted according to
    /// their start record (ascending).
    std::vector<Piece> pieces;
    std::unordered_map<SynthTrace::ObjectID, DefAndUse> locals;

    explicit Call() = delete;
    explicit Call(const Piece &piece) {
      pieces.emplace_back(piece);
    }
    explicit Call(Piece &&piece) {
      pieces.emplace_back(std::move(piece));
    }
  };

  /// A HostFunctionToCalls is a mapping from a host function id to the list of
  /// calls associated with that host function's execution. The calls are
  /// ordered by invocation (the 0th element is the 1st call).
  using HostFunctionToCalls =
      std::unordered_map<SynthTrace::ObjectID, std::vector<Call>>;
  /// A PropNameToCalls is a mapping from property names to a list of
  /// calls on that property. The calls are ordered by invocation (the 0th
  /// element is the 1st call).
  using PropNameToCalls = std::unordered_map<std::string, std::vector<Call>>;
  /// A HostObjectToCalls is a mapping from a host object id to the
  /// mapping of property names to calls associated with accessing properties of
  /// that host object.
  using HostObjectToCalls =
      std::unordered_map<SynthTrace::ObjectID, PropNameToCalls>;

  /// Options for executing the trace.
  /// \param snapshotMarker If the given marker is seen, take a heap snapshot.
  /// \param snapshotMarkerFileName If the marker given in snapshotMarker
  ///   is seen, write the heap snapshot out to this file.
  /// \param warmupReps Number of initial executions whose stats are discarded.
  /// \param reps Number of repetitions of execution. Stats returned are those
  ///   for the rep with the median totalTime.
  /// \param minHeapSize if non-zero, the minimum heap size, overriding
  ///   the value stored in the trace.
  /// \param maxHeapSize if non-zero, the maximum heap size, overriding
  ///   the value stored in the trace.
  /// \param allocInYoung: determines whether the GC initially allocates in
  ///   the young generation.
  /// \param revertToYGAtTTI: if true, and if the GC was not allocating in the
  ///   young generation, change back to young-gen allocation at TTI.
  struct ExecuteOptions {
    std::string marker;
    std::string snapshotMarker;
    std::string snapshotMarkerFileName;
    int warmupReps{0};
    int reps{1};
    ::hermes::vm::gcheapsize_t minHeapSize{0};
    ::hermes::vm::gcheapsize_t maxHeapSize{0};
    bool allocInYoung{true};
    bool revertToYGAtTTI{true};
    bool forceGCBeforeStats{false};
    bool shouldPrintGCStats{false};
    bool shouldTrackIO{false};
    uint8_t bytecodeWarmupPercent{0};
    double sanitizeRate{0.0};
    int64_t sanitizeRandomSeed{-1};
  };

 private:
  jsi::Runtime &rt;
  ExecuteOptions options;
  llvm::raw_ostream *outTrace;
  std::unique_ptr<const jsi::Buffer> bundle;
  const SynthTrace &trace;
  const std::unordered_map<SynthTrace::ObjectID, DefAndUse> &globalDefsAndUses;
  const HostFunctionToCalls &hostFunctionCalls;
  const HostObjectToCalls &hostObjectCalls;
  std::unordered_map<SynthTrace::ObjectID, jsi::Function> hostFunctions;
  std::unordered_map<SynthTrace::ObjectID, uint64_t> hostFunctionsCallCount;
  // NOTE: Theoretically a host object property can have both a getter and a
  // setter. Since this doesn't occur in practice currently, this
  // implementation will ignore it. If it does happen, the value of the
  // interior map should turn into a pair of functions, and a pair of function
  // counts.
  std::unordered_map<SynthTrace::ObjectID, jsi::Object> hostObjects;
  std::unordered_map<
      SynthTrace::ObjectID,
      std::unordered_map<std::string, uint64_t>>
      hostObjectsCallCount;
  std::unordered_map<SynthTrace::ObjectID, jsi::Object> gom;
  std::string stats;
  /// Whether the marker was reached.
  bool markerFound{false};
  /// Whether the snapshot marker was reached.
  bool snapshotMarkerFound{false};
  /// Depth in the execution stack. Zero is the outermost function.
  uint64_t depth{0};

 public:
  /// Execute the trace given by \p traceFile, that was the trace of executing
  /// the bundle given by \p bytecodeFile.
  static void exec(
      const std::string &traceFile,
      const std::string &bytecodeFile,
      const ExecuteOptions &options);

  /// Same as exec, except it prints out the stats of a run.
  /// \return The stats collected by the runtime about times and memory usage.
  static std::string execAndGetStats(
      const std::string &traceFile,
      const std::string &bytecodeFile,
      const ExecuteOptions &options);

  /// Same as exec, except it additionally traces the execution of the
  /// interpreter. This trace can be compared to the original to detect
  /// correctness issues.
  static void execAndTrace(
      const std::string &traceFile,
      const std::string &bytecodeFile,
      const ExecuteOptions &options,
      llvm::raw_ostream &outTrace);

  /// \param outTrace If non-null, write a trace of the execution into this
  /// stream.
  static std::string execFromMemoryBuffer(
      std::unique_ptr<llvm::MemoryBuffer> traceBuf,
      std::unique_ptr<llvm::MemoryBuffer> codeBuf,
      const ExecuteOptions &options,
      llvm::raw_ostream *outTrace);

 private:
  TraceInterpreter(
      jsi::Runtime &rt,
      const ExecuteOptions &options,
      llvm::raw_ostream *outTrace,
      const SynthTrace &trace,
      std::unique_ptr<const jsi::Buffer> bundle,
      const std::unordered_map<SynthTrace::ObjectID, DefAndUse>
          &globalDefsAndUses,
      const HostFunctionToCalls &hostFunctionCalls,
      const HostObjectToCalls &hostObjectCalls);

  static std::string execFromFileNames(
      const std::string &traceFile,
      const std::string &bytecodeFile,
      const ExecuteOptions &options,
      llvm::raw_ostream *outTrace);

  static std::string exec(
      jsi::Runtime &rt,
      const ExecuteOptions &options,
      const SynthTrace &trace,
      std::unique_ptr<const jsi::Buffer> bundle,
      llvm::raw_ostream *outTrace);

  jsi::Function createHostFunction(
      SynthTrace::ObjectID funcID,
      const std::vector<Call> &calls);

  jsi::Object createHostObject(
      SynthTrace::ObjectID objID,
      const PropNameToCalls &propToCalls);

  std::string execEntryFunction(const Call &entryFunc);

  jsi::Value execFunction(
      const Call &entryFunc,
      const jsi::Value &thisVal,
      const jsi::Value *args,
      uint64_t count);

  /// Add \p obj, whose id is \p objID and occurs at \p globalRecordNum, to
  /// either the globals or the \p locals depending on if it is used locally or
  /// not.
  void addObjectToDefs(
      const Call &call,
      SynthTrace::ObjectID objID,
      uint64_t globalRecordNum,
      const jsi::Object &obj,
      std::unordered_map<SynthTrace::ObjectID, jsi::Object> &locals);

  /// Same as above, except it avoids copies on temporary objects.
  void addObjectToDefs(
      const Call &call,
      SynthTrace::ObjectID objID,
      uint64_t globalRecordNum,
      jsi::Object &&obj,
      std::unordered_map<SynthTrace::ObjectID, jsi::Object> &locals);

  std::string printStats();
};

} // namespace tracing
} // namespace hermes
} // namespace facebook
