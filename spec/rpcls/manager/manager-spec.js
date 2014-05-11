var mgr = require('rpcls/manager');
var msg = require('rpcls/message');

function voidFunction() {}

function MockSocket() {
  this.actions = [];
}

MockSocket.prototype = {
  write: voidFunction,

  on: function(key, action) {
    if (key == 'data') this.actions.push(action);
  },

  execute: function(message) {
    for (var actionIndex in this.actions) {
      this.actions[actionIndex].call(this, message);
    }
  }
};
