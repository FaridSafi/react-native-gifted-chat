/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the LICENSE
 * file in the root directory of this source tree.
 */
#ifndef HERMES_VM_PROFILER_MEMORYEVENTTRACKER_H
#define HERMES_VM_PROFILER_MEMORYEVENTTRACKER_H

#include <cstdint>

namespace hermes {
namespace vm {
/// This is the interface for the memory profiler that will track
/// allocations, calls, returns, moves, and deletes. It should
/// be inhertied from and implemented to the profilign needs, i.e
/// to a file, to a different format, to JSON, etc.
class MemoryEventTracker {
 public:
  virtual ~MemoryEventTracker() = default;
  // Emit an allocation of a cell with kind `kind` and allocated
  // size `size`.
  virtual void emitAlloc(uint32_t kind, uint32_t size) = 0;
};

} // namespace vm
} // namespace hermes

#endif // HERMES_VM_PROFILER_MEMORYEVENTTRACKER_H
