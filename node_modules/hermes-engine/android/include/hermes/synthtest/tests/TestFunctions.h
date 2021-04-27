/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the LICENSE
 * file in the root directory of this source tree.
 */
#ifndef HERMES_API_SYNTHTEST_TESTS_TESTFUNCTIONS
#define HERMES_API_SYNTHTEST_TESTS_TESTFUNCTIONS

#define FOREACH_TEST(F)              \
  F(callbacksCallJSFunction)         \
  F(dateAsFunction)                  \
  F(dateAsNew)                       \
  F(dateNow)                         \
  F(globalReturnObject)              \
  F(getPropertyNames)                \
  F(hostCallsJS)                     \
  F(hostCallsJSCallsHost)            \
  F(hostCallsJSWithThis)             \
  F(hostFunctionCachesObject)        \
  F(hostFunctionCreatesObjects)      \
  F(hostFunctionMutatesGlobalObject) \
  F(hostFunctionMutatesObject)       \
  F(hostFunctionReturn)              \
  F(hostFunctionReturnArgument)      \
  F(hostGlobalObject)                \
  F(mathRandom)                      \
  F(nativeSetsConstant)              \
  F(parseGCConfig)

#define TEST_FUNC_FORWARD_DECL(name) \
  const char *name##Trace();         \
  const char *name##Source();

namespace facebook {
namespace hermes {
namespace synthtest {

// Forward decls for all of the functions used.
FOREACH_TEST(TEST_FUNC_FORWARD_DECL)

} // namespace synthtest
} // namespace hermes
} // namespace facebook

#endif
