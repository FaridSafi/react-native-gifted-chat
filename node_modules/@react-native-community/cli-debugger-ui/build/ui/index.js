"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

require("./index.css");

var _blueIcon = _interopRequireDefault(require("./assets/blue-icon.png"));

var _grayIcon = _interopRequireDefault(require("./assets/gray-icon.png"));

var _orangeIcon = _interopRequireDefault(require("./assets/orange-icon.png"));

/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

/* eslint-env browser */
const isMacLike = /(Mac|iPhone|iPod|iPad)/i.test(navigator.platform);
const refreshShortcut = isMacLike ? '⌘R' : 'Ctrl R';

window.onload = function () {
  if (!isMacLike) {
    document.getElementById('shortcut').innerHTML = 'Ctrl⇧J';
  }

  Page.render();
};

window.onReloadClicked = function () {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', `${window.location.origin}/reload`, true);
  xhr.send();
};

const Page = window.Page = {
  state: {
    isDark: localStorage.getItem('darkTheme') === null ? window.matchMedia('(prefers-color-scheme: dark)').matches : localStorage.getItem('darkTheme') === 'on',
    isPriorityMaintained: localStorage.getItem('maintainPriority') === 'on',
    status: {
      type: 'disconnected'
    },
    visibilityState: document.visibilityState
  },

  setState(partialState) {
    Page.state = Object.assign({}, Page.state, partialState);
    Page.render();
  },

  render() {
    const {
      isDark,
      isPriorityMaintained,
      status,
      visibilityState
    } = Page.state;
    const statusNode = document.getElementById('status');

    switch (status.type) {
      case 'connected':
        statusNode.innerHTML = 'Debugger session #' + status.id + ' active.';
        break;

      case 'error':
        statusNode.innerHTML = status.error.reason || 'Disconnected from proxy. Attempting reconnection. Is node server running?';
        break;

      case 'connecting':
      case 'disconnected': // Fall through.

      default:
        statusNode.innerHTML = 'Waiting, press <span class="shortcut">' + refreshShortcut + '</span> in simulator to reload and connect.';
        break;
    }

    const linkNode = document.querySelector('link[rel=icon]');

    if (status.type === 'disconnected' || status.type === 'error') {
      linkNode.href = _grayIcon.default;
    } else {
      if (visibilityState === 'visible' || isPriorityMaintained) {
        linkNode.href = _blueIcon.default;
      } else {
        linkNode.href = _orangeIcon.default;
      }
    }

    const darkCheckbox = document.getElementById('dark');
    document.body.classList.toggle('dark', isDark);
    darkCheckbox.checked = isDark;
    localStorage.setItem('darkTheme', isDark ? 'on' : '');
    const maintainPriorityCheckbox = document.getElementById('maintain-priority');
    const silence = document.getElementById('silence');
    silence.volume = 0.1;

    if (isPriorityMaintained) {
      silence.play();
    } else {
      silence.pause();
    }

    maintainPriorityCheckbox.checked = isPriorityMaintained;
    localStorage.setItem('maintainPriority', isPriorityMaintained ? 'on' : '');
  },

  toggleDarkTheme() {
    Page.setState({
      isDark: !Page.state.isDark
    });
  },

  togglePriorityMaintenance() {
    Page.setState({
      isPriorityMaintained: !Page.state.isPriorityMaintained
    });
  }

};

function connectToDebuggerProxy() {
  const ws = new WebSocket('ws://' + window.location.host + '/debugger-proxy?role=debugger&name=Chrome');
  let worker;

  function createJSRuntime() {
    // This worker will run the application JavaScript code,
    // making sure that it's run in an environment without a global
    // document, to make it consistent with the JSC executor environment.
    worker = new Worker('./debuggerWorker.js');

    worker.onmessage = function (message) {
      ws.send(JSON.stringify(message.data));
    };

    window.onbeforeunload = function () {
      return 'If you reload this page, it is going to break the debugging session. ' + 'Press ' + refreshShortcut + ' on the device to reload.';
    };

    updateVisibility();
  }

  function shutdownJSRuntime() {
    if (worker) {
      worker.terminate();
      worker = null;
      window.onbeforeunload = null;
    }
  }

  function updateVisibility() {
    if (worker && !Page.state.isPriorityMaintained) {
      worker.postMessage({
        method: 'setDebuggerVisibility',
        visibilityState: document.visibilityState
      });
    }

    Page.setState({
      visibilityState: document.visibilityState
    });
  }

  ws.onopen = function () {
    Page.setState({
      status: {
        type: 'connecting'
      }
    });
  };

  ws.onmessage = async function (message) {
    if (!message.data) {
      return;
    }

    const object = JSON.parse(message.data);

    if (object.$event === 'client-disconnected') {
      shutdownJSRuntime();
      Page.setState({
        status: {
          type: 'disconnected'
        }
      });
      return;
    }

    if (!object.method) {
      return;
    } // Special message that asks for a new JS runtime


    if (object.method === 'prepareJSRuntime') {
      shutdownJSRuntime();
      console.clear();
      createJSRuntime();
      ws.send(JSON.stringify({
        replyID: object.id
      }));
      Page.setState({
        status: {
          type: 'connected',
          id: object.id
        }
      });
    } else if (object.method === '$disconnected') {
      shutdownJSRuntime();
      Page.setState({
        status: {
          type: 'disconnected'
        }
      });
    } else {
      worker.postMessage(object);
    }
  };

  ws.onclose = function (error) {
    shutdownJSRuntime();
    Page.setState({
      status: {
        type: 'error',
        error
      }
    });

    if (error.reason) {
      console.warn(error.reason);
    }

    setTimeout(connectToDebuggerProxy, 500);
  }; // Let debuggerWorker.js know when we're not visible so that we can warn about
  // poor performance when using remote debugging.


  document.addEventListener('visibilitychange', updateVisibility, false);
}

connectToDebuggerProxy();