/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the LICENSE
 * file in the root directory of this source tree.
 */
#ifndef HERMES_COMPILEJS_H
#define HERMES_COMPILEJS_H

#include <string>

namespace hermes {

/// Compiles JS source \p str and if compilation is successful, returns true
/// and outputs to \p bytecode otherwise returns false.
/// \param sourceURL this will be used as the "file name" of the buffer for
///   errors, stack traces, etc.
/// NOTE: Doesn't throw any exceptions. It's up to the caller to report failure.
///
/// TODO(30388684): Return opaque object that can be run or serialized.
bool compileJS(
    const std::string &str,
    const std::string &sourceURL,
    std::string &bytecode,
    bool optimize = true);

bool compileJS(
    const std::string &str,
    std::string &bytecode,
    bool optimize = true);

} // namespace hermes

#endif
