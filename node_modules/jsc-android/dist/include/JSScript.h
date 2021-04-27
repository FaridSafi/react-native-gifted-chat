/*
 * Copyright (C) 2019 Apple Inc. All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions
 * are met:
 * 1. Redistributions of source code must retain the above copyright
 *    notice, this list of conditions and the following disclaimer.
 * 2. Redistributions in binary form must reproduce the above copyright
 *    notice, this list of conditions and the following disclaimer in the
 *    documentation and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY APPLE INC. ``AS IS'' AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
 * PURPOSE ARE DISCLAIMED.  IN NO EVENT SHALL APPLE INC. OR
 * CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 * EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
 * PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
 * PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY
 * OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

#import <JavaScriptCore/JSValue.h>

#if JSC_OBJC_API_ENABLED

NS_ASSUME_NONNULL_BEGIN

@class JSVirtualMachine;

JSC_CLASS_AVAILABLE(macosx(JSC_MAC_TBA), ios(JSC_IOS_TBA))
@interface JSScript : NSObject

/*!
 @method
 @abstract Create a JSScript for the specified virtual machine.
 @param source The source code to use when the script is evaluated by the JS vm.
 @param vm The JSVirtualMachine the script can be evaluated in.
 @result The new script.
 */
+ (nullable instancetype)scriptWithSource:(NSString *)source inVirtualMachine:(JSVirtualMachine *)vm;

/*!
 @method
 @abstract Create a JSScript for the specified virtual machine with a path to a codesigning and bytecode caching.
 @param filePath A URL containing the path to a JS source code file on disk.
 @param vm The JSVirtualMachine the script can be evaluated in.
 @param codeSigningPath A URL containing the path to the codeSigning file for filePath on disk.
 @param cachePath A URL containing the path where the VM should cache for future execution.
 @result The new script.
 @discussion the files at filePath, codeSigningPath, and cachePath should not be externally modified  for the lifecycle of vm. Note that codeSigningPath and cachePath are not used currently, but that will change in the near future.

 If the file at filePath is not ascii this method will return nil.
 */
+ (nullable instancetype)scriptFromASCIIFile:(NSURL *)filePath inVirtualMachine:(JSVirtualMachine *)vm withCodeSigning:(nullable NSURL *)codeSigningPath andBytecodeCache:(nullable NSURL *)cachePath;


/*!
 This is deprecated and is equivalent to scriptFromASCIIFile:inVirtualMachine:withCodeSigning:andBytecodeCache:.
 */
+ (nullable instancetype)scriptFromUTF8File:(NSURL *)filePath inVirtualMachine:(JSVirtualMachine *)vm withCodeSigning:(nullable NSURL *)codeSigningPath andBytecodeCache:(nullable NSURL *)cachePath;

@end

NS_ASSUME_NONNULL_END

#endif // JSC_OBJC_API_ENABLED
