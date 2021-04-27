/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the LICENSE
 * file in the root directory of this source tree.
 */
#ifndef HERMES_PUBLIC_BUFFER_H
#define HERMES_PUBLIC_BUFFER_H

#include <cstddef>
#include <cstdint>

namespace hermes {

/// A generic buffer interface.  E.g. for memmapped bytecode.
class Buffer {
 public:
  Buffer() : data_(nullptr), size_(0) {}

  Buffer(const uint8_t *data, size_t size) : data_(data), size_(size) {}

  virtual ~Buffer() {}

  const uint8_t *data() const {
    return data_;
  };

  size_t size() const {
    return size_;
  }

 protected:
  const uint8_t *data_ = nullptr;
  size_t size_ = 0;
};

} // namespace hermes

#endif
