/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the LICENSE
 * file in the root directory of this source tree.
 */
#ifndef HERMES_PUBLIC_GCCONFIG_H
#define HERMES_PUBLIC_GCCONFIG_H

#include "hermes/Public/CtorConfig.h"
#include "hermes/Public/GCTripwireContext.h"
#include "hermes/Public/MemoryEventTracker.h"

#include <algorithm>
#include <cassert>
#include <chrono>
#include <cstdint>
#include <functional>
#include <limits>
#include <memory>
#include <string>

namespace hermes {
namespace vm {

/// A type big enough to accomodate the entire allocated address space.
/// Individual allocations are always 'uint32_t', but on a 64-bit machine we
/// might want to accommodate a larger total heap (or not, in which case we keep
/// it 32-bit).
using gcheapsize_t = uint32_t;

/// Parameters to control a tripwire function called when the live set size
/// surpasses a given threshold after collections.  Check documentation in
/// README.md
#define GC_TRIPWIRE_FIELDS(F)                                                  \
  /* Minimum time to wait between tripwire trigger events. */                  \
  F(std::chrono::hours, Cooldown, 24)                                          \
                                                                               \
  /* If the heap size is above this threshold after a collection, the tripwire \
   * is triggered. */                                                          \
  F(gcheapsize_t, Limit, std::numeric_limits<gcheapsize_t>::max())             \
                                                                               \
  /* The callback to call when the tripwire is considered triggered. */        \
  F(std::function<void(GCTripwireContext &)>, Callback, nullptr)               \
  /* GC_TRIPWIRE_FIELDS END */

_HERMES_CTORCONFIG_STRUCT(GCTripwireConfig, GC_TRIPWIRE_FIELDS, {});

#undef HEAP_TRIPWIRE_FIELDS

#define GC_HANDLESAN_FIELDS(F)                                        \
  /* The probability with which the GC should keep moving the heap */ \
  /* to detect stale GC handles. */                                   \
  F(double, SanitizeRate, 0.0)                                        \
  /* Random seed to use for basis of decisions whether or not to */   \
  /* sanitize. A negative value will mean a seed will be chosen at */ \
  /* random. */                                                       \
  F(int64_t, RandomSeed, -1)                                          \
  /* GC_HANDLESAN_FIELDS END */

_HERMES_CTORCONFIG_STRUCT(GCSanitizeConfig, GC_HANDLESAN_FIELDS, {});

#undef GC_HANDLESAN_FIELDS

/// Parameters for GC Initialisation.  Check documentation in README.md
#define GC_FIELDS(F)                                                       \
  /* Minimum heap size hint. */                                            \
  F(gcheapsize_t, MinHeapSize, 0)                                          \
                                                                           \
  /* Initial heap size hint. */                                            \
  F(gcheapsize_t, InitHeapSize, 32 << 20)                                  \
                                                                           \
  /* Maximum heap size hint. */                                            \
  F(gcheapsize_t, MaxHeapSize, 512 << 20)                                  \
                                                                           \
  /* Number of consecutive full collections considered to be an OOM. */    \
  F(unsigned, EffectiveOOMThreshold, std::numeric_limits<unsigned>::max()) \
                                                                           \
  /* Sanitizer configuration for the GC. */                                \
  F(GCSanitizeConfig, SanitizeConfig)                                      \
                                                                           \
  /* Whether the GC should spread allocations across all its "spaces". */  \
  F(bool, ShouldRandomizeAllocSpace, false)                                \
                                                                           \
  /* Whether to Keep track of GC Statistics. */                            \
  F(bool, ShouldRecordStats, false)                                        \
                                                                           \
  /* Whether to return unused memory to the OS. */                         \
  F(bool, ShouldReleaseUnused, true)                                       \
                                                                           \
  /* Name for this heap in logs. */                                        \
  F(std::string, Name, "HermesRuntime")                                    \
                                                                           \
  /* Configuration for the Heap Tripwire. */                               \
  F(GCTripwireConfig, TripwireConfig)                                      \
                                                                           \
  /* Whether to (initially) allocate from the young gen (true) or the */   \
  /* old gen (false). */                                                   \
  F(bool, AllocInYoung, true)                                              \
                                                                           \
  /* Whether to revert, if necessary, to young-gen allocation at TTI. */   \
  F(bool, RevertToYGAtTTI, false)                                          \
                                                                           \
  /* Pointer to the memory profiler (Memory Event Tracker). */             \
  F(std::shared_ptr<MemoryEventTracker>, MemEventTracker, nullptr)         \
  /* GC_FIELDS END */

_HERMES_CTORCONFIG_STRUCT(GCConfig, GC_FIELDS, {
  if (builder.hasMinHeapSize()) {
    if (builder.hasInitHeapSize()) {
      // If both are specified, normalize the initial size up to the minimum,
      // if necessary.
      InitHeapSize_ = std::max(MinHeapSize_, InitHeapSize_);
    } else {
      // If the minimum is set explicitly, but the initial heap size is not,
      // use the minimum as the initial size.
      InitHeapSize_ = MinHeapSize_;
    }
  }
  assert(InitHeapSize_ >= MinHeapSize_);

  // Make sure the max is at least the Init.
  MaxHeapSize_ = std::max(InitHeapSize_, MaxHeapSize_);
});

#undef GC_FIELDS

} // namespace vm
} // namespace hermes

#endif // HERMES_PUBLIC_GCCONFIG_H
