<!--
#
# Licensed to the Apache Software Foundation (ASF) under one
# or more contributor license agreements.  See the NOTICE file
# distributed with this work for additional information
# regarding copyright ownership.  The ASF licenses this file
# to you under the Apache License, Version 2.0 (the
# "License"); you may not use this file except in compliance
# with the License.  You may obtain a copy of the License at
#
# http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing,
# software distributed under the License is distributed on an
# "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
#  KIND, either express or implied.  See the License for the
# specific language governing permissions and limitations
# under the License.
#
-->

# cordova-node-xcode

[![NPM](https://nodei.co/npm/xcode.png?compact=true)](https://nodei.co/npm/xcode/)
[![Build Status](https://travis-ci.org/apache/cordova-node-xcode.svg?branch=master)](https://travis-ci.org/apache/cordova-node-xcode)

Parser utility for xcodeproj project files

Allows you to edit xcodeproject files and write them back out.

based on donated code from [alunny / node-xcode](https://github.com/alunny/node-xcode)

## Example

```js
// API is a bit wonky right now
var xcode = require('xcode'),
    fs = require('fs'),
    projectPath = 'myproject.xcodeproj/project.pbxproj',
    myProj = xcode.project(projectPath);

// parsing is async, in a different process
myProj.parse(function (err) {
    myProj.addHeaderFile('foo.h');
    myProj.addSourceFile('foo.m');
    myProj.addFramework('FooKit.framework');
   
    fs.writeFileSync(projectPath, myProj.writeSync());
    console.log('new project written');
});
```

## Working on the parser

If there's a problem parsing, you will want to edit the grammar under
`lib/parser/pbxproj.pegjs`. You can test it online with the PEGjs online thingy
at https://pegjs.org/online - I have had some mixed results though.

Tests under the `test/parser` directory will compile the parser from the
grammar. Other tests will use the prebuilt parser (`lib/parser/pbxproj.js`).

To rebuild the parser js file after editing the grammar, run:

    npm run pegjs

(and be sure to restore the Apache license notice in
`lib/parser/pbxproj.js` before committing)

## License

Apache V2
