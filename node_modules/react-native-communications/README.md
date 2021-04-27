# react-native-communications

[Release Notes](https://github.com/anarchicknight/react-native-communications/releases)

Open a web address, easily call, email, text, iMessage (iOS only) someone in React Native

## Installation

**React Native >= 0.25**

```bash
npm install react-native-communications
```

---

**React Native >=0.20 < 0.25**

```bash
npm install react-native-communications@1.0.1
```

**Note:** Do not use version 1.0.0 of this module as it contained a bug with the phonecall method.

---

**React Native >=0.15 <=0.19**

```bash
npm install react-native-communications@0.2.3
```

---

## Methods

```js
phonecall(phoneNumber, prompt)

phoneNumber - String
prompt - Boolean
```

Both arguments are required and need to be of the correct type.

###### iOS

If `prompt` is true it uses the undocumented `telprompt:` url scheme. This triggers an alert asking user to confirm if they want to dial the number. There are conflicting reports around the internet about whether Apple will allow apps using this scheme to be submitted to the App store (some have had success and others have had rejections).

If you face any problems having apps approved because of this raise an issue in this repo and I will look at removing it.

###### Android

`telprompt:` is not supported on Android. The `prompt` argument is ignored when run on Android devices.

---

```js
email(to, cc, bcc, subject, body)

to - String Array
cc - String Array
bcc - String Array
subject - String
body - String
```

You must supply either 0 arguments or the full set (5).

If 0 arguments are supplied the new email view will be launched with no prefilled details.

If 5 are supplied they will be checked against their expected type and ignored if the type is incorrect.

If there are any arguments you don't want to provide a value for set them as `null` or `undefined`.

e.g.

`email(['emailAddress'], null, null, null, 'my body text')` would open the new email view with a recipient and body text prefilled.

`email(null, ['emailAddress1', 'emailAddress2'], null, 'my subject', null)` would open the new email view with two recipients in the cc field and a subject prefilled.

`email([123, 'emailAddress'], null, null, 789, ['my body text'])` would open the new email view with one recipient prefilled and no other values.

---

```js
text(phoneNumber, body)

phoneNumber - String
body - String
```

**Note**:
This method encodes the message body if provided (related to issue [#34](https://github.com/anarchicknight/react-native-communications/issues/34)). Some people have reported that this causes issues with spaces showing up as %20 on their devices. If this is the case for you please use the `textWithoutEncoding` method instead.

If 0 arguments are provided the new message view will launch with no recipient specified and no prefilled message.

If only 1 argument is supplied it will be interpreted as the phoneNumber argument. If it is the correct type then the new message view will be launched with the recipient specified and no message prefilled. If it is the incorrect type then it will be ignored and the new message view launched as if 0 arguments were supplied.

If 2 arguments are provided the first will be interpreted as the phone number and the second as the message to prefill. If both arguments are the correct type then the new message view will be launched with the recipient specified and the message prefilled. If either argument is the wrong type it will be ignored. This makes it possible for example, to launch the new message view with no recipient but a prefilled message by calling `text(null, 'React Native is great!')`.

The method will exit if more than 2 arguments are provided and the new message view will not be launched.

---

```js
textWithoutEncoding(phoneNumber, body)

phoneNumber - String
body - String
```

**Note**:
This method has been added as a temporary fix for [#43](https://github.com/anarchicknight/react-native-communications/issues/43). If you are going to use this method please be aware that if you have any text for your message body which needs to be encoded you are responsible for doing this yourself before passing the string to the method.

If 0 arguments are provided the new message view will launch with no recipient specified and no prefilled message.

If only 1 argument is supplied it will be interpreted as the phoneNumber argument. If it is the correct type then the new message view will be launched with the recipient specified and no message prefilled. If it is the incorrect type then it will be ignored and the new message view launched as if 0 arguments were supplied.

If 2 arguments are provided the first will be interpreted as the phone number and the second as the message to prefill. If both arguments are the correct type then the new message view will be launched with the recipient specified and the message prefilled. If either argument is the wrong type it will be ignored. This makes it possible for example, to launch the new message view with no recipient but a prefilled message by calling `textWithoutEncoding(null, 'React Native is great!')`.

The method will exit if more than 2 arguments are provided and the new message view will not be launched.

---

```js
web(address)

address - String
```

Current requirements for `address` are that it is provided and is a String. There is no validation on whether it is a valid address.

## Usage

**Note:**

This will only work fully when run on actual devices. The iOS simulator only supports the `web` method and does not have the required device components installed to run any of the other methods. The Android emulator can run all the methods apart from `email`.

Assuming you have `npm install -g react-native-cli`, first generate an app:

```bash
react-native init RNCommunications
cd RNCommunications
npm install react-native-communications --save
```

Then paste the following into `RNCommunications/index.ios.js` and/or `RNCommunications/index.android.js`:

**Note:** The following sample code has been updated to use es6 syntax and imports supported from React Native 0.25 onwards

```js
'use strict';

import React from 'react';

import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableOpacity
} from 'react-native';

// either import the whole module and call as Communications.method()
import Communications from 'react-native-communications';

// or can now import single methods and call straight via the method name
// import { web, phonecall } from 'react-native-communications';
// e.g. onPress={() => { web('http://www.github.com') }}

const RNCommunications = React.createClass({

  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={() => Communications.phonecall('0123456789', true)}>
          <View style={styles.holder}>
            <Text style={styles.text}>Make phonecall</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => Communications.email(['emailAddress1', 'emailAddress2'],null,null,'My Subject','My body text')}>
          <View style={styles.holder}>
            <Text style={styles.text}>Send an email</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => Communications.text('0123456789')}>
          <View style={styles.holder}>
            <Text style={styles.text}>Send a text/iMessage</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => Communications.web('https://github.com/facebook/react-native')}>
          <View style={styles.holder}>
            <Text style={styles.text}>Open react-native repo on Github</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'rgb(253,253,253)',
  },
  holder: {
    flex: 0.25,
    justifyContent: 'center',
  },
  text: {
    fontSize: 32,
  },
});

AppRegistry.registerComponent('RNCommunications', () => RNCommunications);
```

## TODO

- [ ] Work on V3 of the library to make major changes to how arguments are passed to methods and to change how we handle encoding of various parameters
