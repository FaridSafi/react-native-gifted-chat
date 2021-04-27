/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the LICENSE
 * file in the root directory of this source tree.
 */
#ifndef HERMES_DEBUGGERAPI_H
#define HERMES_DEBUGGERAPI_H

#ifdef HERMES_ENABLE_DEBUGGER

#include <hermes/hermes.h>
#include <cassert>
#include <memory>
#include <vector>

#include "hermes/Public/DebuggerTypes.h"

// Forward declarations of internal types.
namespace hermes {
namespace vm {
class CodeBlock;
class Debugger;
struct DebugCommand;
class HermesValue;
} // namespace vm
} // namespace hermes

namespace facebook {
namespace hermes {
class HermesRuntime;

namespace debugger {

class Debugger;
class EventObserver;

/// Represents a variable in the debugger.
struct VariableInfo {
  /// Name of the variable in the source.
  String name;

  /// Value of the variable.
  ::facebook::jsi::Value value;
};

/// An EvalResult represents the result of an Eval command.
struct EvalResult {
  /// The resulting JavaScript object, or the thrown exception.
  ::facebook::jsi::Value value;

  /// Indicates that the result was an exception.
  bool isException = false;

  /// If isException is true, details about the exception.
  ExceptionDetails exceptionDetails;

  EvalResult(EvalResult &&) = default;
  EvalResult() = default;

  EvalResult(
      ::facebook::jsi::Value value,
      bool isException,
      ExceptionDetails exceptionDetails)
      : value(std::move(value)),
        isException(isException),
        exceptionDetails(std::move(exceptionDetails)) {}
};

/// ProgramState represents the state of a paused program. An instance of
/// ProgramState is available as the getProgramState() member function of class
/// Debugger.
class ProgramState {
 public:
  /// \return the reason for the Pause.
  PauseReason getPauseReason() const {
    return pauseReason_;
  }

  /// \return the breakpoint if the PauseReason is Breakpoint, otherwise
  /// kInvalidBreakpoint.
  BreakpointID getBreakpoint() const {
    return breakpoint_;
  }

  /// \return the evaluation result if the PauseReason is due to EvalComplete.
  EvalResult getEvalResult() const;

  /// \returns a stack trace for the current execution.
  const StackTrace &getStackTrace() const {
    return stackTrace_;
  }

  /// \returns lexical information about the state in a given frame.
  LexicalInfo getLexicalInfo(uint32_t frameIndex) const;

  /// \return information about a variable in a given lexical scope, in a given
  /// frame.
  VariableInfo getVariableInfo(
      uint32_t frameIndex,
      ScopeDepth scopeDepth,
      uint32_t variableIndexInScope) const;

  /// \return information about the `this` value at a given stack depth.
  VariableInfo getVariableInfoForThis(uint32_t frameIndex) const;

  /// \return the number of variables in a given frame.
  /// This is deprecated: prefer using getLexicalInfoInFrame().
  uint32_t getVariablesCountInFrame(uint32_t frameIndex) const {
    auto info = getLexicalInfo(frameIndex);
    uint32_t result = 0;
    for (ScopeDepth i = 0, max = info.getScopesCount(); i < max; i++)
      result += info.getVariablesCountInScope(i);
    return result;
  }

  /// \return info for a variable at a given index \p variableIndex, in a given
  /// frame at index \p frameIndex.
  /// This is deprecated. Prefer the getVariableInfo() that takes three
  /// parameters.
  VariableInfo getVariableInfo(uint32_t frameIndex, uint32_t variableIndex)
      const {
    LexicalInfo info = getLexicalInfo(frameIndex);
    uint32_t remaining = variableIndex;
    for (ScopeDepth scope = 0;; scope++) {
      assert(scope < info.getScopesCount() && "Index out of bounds");
      uint32_t count = info.getVariablesCountInScope(scope);
      if (remaining < count) {
        return getVariableInfo(frameIndex, scope, remaining);
      }
      remaining -= count;
    }
  }

 private:
  friend Debugger;
  /// ProgramState must not be copied, because some of its implementation
  /// requires querying the live program state and so the state must not be
  /// retained after the pause returns.
  /// ProgramState must not be copied.
  ProgramState(const ProgramState &) = delete;
  ProgramState &operator=(const ProgramState &) = delete;

  ::hermes::vm::Debugger *impl() const;

  ProgramState(Debugger *dbg) : dbg_(dbg) {}
  Debugger *dbg_;
  PauseReason pauseReason_{};
  StackTrace stackTrace_;
  EvalResult evalResult_;
  BreakpointID breakpoint_{kInvalidBreakpoint};
};

/// Command represents an action that you can request the debugger to perform
/// when returned from didPause().
class Command {
 public:
  /// Commands may be moved.
  Command(Command &&);
  Command &operator=(Command &&);
  ~Command();

  /// \return a Command that steps with the given StepMode \p mode.
  static Command step(StepMode mode);

  /// \return a Command that continues execution.
  static Command continueExecution();

  /// \return a Command that evaluates JavaScript code \p src in the
  /// frame at index \p frameIndex.
  static Command eval(const String &src, uint32_t frameIndex);

 private:
  friend Debugger;
  explicit Command(::hermes::vm::DebugCommand &&);
  std::unique_ptr<::hermes::vm::DebugCommand> debugCommand_;
};

/// Debugger allows access to the Hermes debugging functionality. An instance of
/// Debugger is available from HermesRuntime, and also passed to your
/// EventObserver.
class Debugger {
 public:
  /// Set the Debugger event observer. The event observer is notified of
  /// debugging event, specifically when the program pauses. This is simply a
  /// raw pointer: it is the client's responsibility to clear the event observer
  /// if the event observer is deallocated before the Debugger.
  void setEventObserver(EventObserver *observer);

  /// Sets the property %isDebuggerAttached in %DebuggerInternal object.
  void setIsDebuggerAttached(bool isAttached);

  /// Asynchronously triggers a pause. This may be called from any thread. This
  /// is inherently racey and the exact point at which the program pauses is not
  /// guaranteed. You can discover when the program has paused through the event
  /// observer.
  void triggerAsyncPause();

  /// \return the ProgramState representing the state of the paused program.
  /// This may only be invoked when the program is paused.
  const ProgramState &getProgramState() const {
    return state_;
  }

  /// \return the source map URL for the \p fileId.
  String getSourceMappingUrl(uint32_t fileId) const;

  /// -- Breakpoint Management --

  /// Sets a breakpoint on a given SourceLocation.
  /// \return the ID of the breakpoint, 0 if it wasn't created.
  BreakpointID setBreakpoint(SourceLocation loc);

  /// Sets the condition on breakpoint \p breakpoint.
  /// The condition will be stored with the breakpoint,
  /// and if non-empty, will be executed to determine whether to actually
  /// pause on the breakpoint; only if ToBoolean(condition) is true
  /// and does not throw will the debugger pause on \p breakpoint.
  /// \param condition the code to execute to determine whether to break;
  /// if empty, the condition is considered to not be set.
  void setBreakpointCondition(BreakpointID breakpoint, const String &condition);

  /// Deletes a breakpoint.
  void deleteBreakpoint(BreakpointID breakpoint);

  /// Deletes all breakpoints.
  void deleteAllBreakpoints();

  /// Mark a breakpoint as enabled. Breakpoints are by default enabled.
  void setBreakpointEnabled(BreakpointID breakpoint, bool enable);

  /// \return information on a breakpoint.
  BreakpointInfo getBreakpointInfo(BreakpointID breakpoint);

  /// \return a list of extant breakpoints.
  std::vector<BreakpointID> getBreakpoints();

  /// Set whether the debugger should pause when an exception is thrown.
  void setPauseOnThrowMode(PauseOnThrowMode mode);

  /// \return whether the debugger pauses when an exception is thrown.
  PauseOnThrowMode getPauseOnThrowMode() const;

  /// Set whether the debugger should pause after a script was loaded.
  void setShouldPauseOnScriptLoad(bool flag);

  /// \return whether the debugger should pause after a script was loaded.
  bool getShouldPauseOnScriptLoad() const;

 private:
  friend std::unique_ptr<HermesRuntime> hermes::makeHermesRuntime(
      const ::hermes::vm::RuntimeConfig &);
  friend std::unique_ptr<jsi::ThreadSafeRuntime>
  hermes::makeThreadSafeHermesRuntime(const ::hermes::vm::RuntimeConfig &);
  friend ProgramState;

  /// Debuggers may not be moved or copied.
  Debugger(const Debugger &) = delete;
  void operator=(const Debugger &) = delete;
  Debugger(Debugger &&) = delete;
  void operator=(Debugger &&) = delete;

  /// Implementation detail used by ProgramState.
  ::facebook::jsi::Value jsiValueFromHermesValue(::hermes::vm::HermesValue hv);

  explicit Debugger(
      ::facebook::hermes::HermesRuntime *runtime,
      ::hermes::vm::Debugger *impl);

  ::facebook::hermes::HermesRuntime *const runtime_;
  EventObserver *eventObserver_ = nullptr;
  ::hermes::vm::Debugger *impl_;
  ProgramState state_;
};

/// A subclass of EventObserver may be set on the Debugger via
/// setEventObserver(). It receives notifications when the Debugger pauses.
class EventObserver {
 public:
  /// didPause() is invoked when the JavaScript program has paused. The
  /// The Debugger \p debugger can be used to manipulate breakpoints and enqueue
  /// debugger commands such as stepping, etc. It can also be used to discover
  /// the call stack and variables via debugger.getProgramState().
  /// \return a Command for the debugger to perform.
  virtual Command didPause(Debugger &debugger) = 0;

  /// Invoked when the debugger resolves a previously unresolved breakpoint.
  /// Note that the debugger is *not* paused during this,
  /// and thus debugger.getProgramState() is not valid.
  /// This callback may not invoke JavaScript or enqueue debugger commands.
  virtual void breakpointResolved(Debugger &debugger, BreakpointID breakpoint) {
  }

  virtual ~EventObserver();
};

} // namespace debugger
} // namespace hermes
} // namespace facebook

#endif // HERMES_ENABLE_DEBUGGER

#endif // HERMES_DEBUGGERAPI_H
