var mgr = require('rpcls/manager');
var msg = require('rpcls/message');
var signs = require('rpcls/rules').signs;

function voidFunction() {}

function MockSocket() {
  this.actions = [];
}

MockSocket.prototype = {
  write: voidFunction,

  on: function(key, action) {
    if (key == 'data') this.actions.push(action);
  },

  execute: function() {
    var message = msg.encode.apply(null, arguments);

    for (var actionIndex in this.actions) {
      this.actions[actionIndex].call(this, message);
    }
  }
};

function getActions(socket, nbOfActions) {
  var actions = [];
  for (var callIndex in socket.write.calls) {
    var callMessages = msg.decode(socket.write.calls[callIndex].args[0]);
    for (var messageIndex in callMessages) {
      actions = actions.concat(callMessages[messageIndex].actions);
    }
  }
  socket.write.reset();

  expect(actions.length).toEqual(nbOfActions);

  return actions;
}

function getAction(socket) {
  var actions = getActions(socket, 1);
  return actions[0];
}

describe('A simple game', function() {

  it('works', function() {
    var manager = new mgr.Manager(0);
    var socket1 = new MockSocket();
    spyOn(socket1, 'write');

    manager.registerClient(socket1);
    expect(socket1.write).toHaveBeenCalled();
    var action = getAction(socket1);
    expect(action.command).toEqual('id');

    var socket2 = new MockSocket();
    spyOn(socket2, 'write');
    manager.registerClient(socket2);
    expect(socket2.write).toHaveBeenCalled();
    action = getAction(socket2);
    expect(action.command).toEqual('id');

    socket1.execute('1', { command: 'create' });
    expect(socket1.write).toHaveBeenCalled();
    action = getAction(socket1);
    expect(action.command).toEqual('game');
    var gameId = action.args[0];
    console.log('game id is ' + gameId);

    socket2.execute('2', { command: 'join', args: [ gameId ] });
    expect(socket2.write).toHaveBeenCalled();
    var actions = getActions(socket2, 2);
    expect(actions[0].command).toEqual('joined');
    expect(actions[1].command).toEqual('play');

    action = getAction(socket1);
    expect(action.command).toEqual('play');
    console.log('game has started');

    // Play ROCK - PAPER
    socket1.execute('1', { command: 'play', args: [ signs.ROCK ] });
    socket2.execute('2', { command: 'play', args: [ signs.PAPER ] });
    actions = getActions(socket1, 2);
    expect(actions[0].command).toEqual('lose');
    expect(actions[0].args).toEqual([ signs.PAPER ]);
    expect(actions[1].command).toEqual('play');
    actions = getActions(socket2, 2);
    expect(actions[0].command).toEqual('win');
    expect(actions[0].args).toEqual([ signs.ROCK ]);
    expect(actions[1].command).toEqual('play');

    // Play CISSORS - PAPER
    socket1.execute('1', { command: 'play', args: [ signs.CISSORS ] });
    socket2.execute('2', { command: 'play', args: [ signs.PAPER ] });
    actions = getActions(socket1, 2);
    expect(actions[0].command).toEqual('win');
    expect(actions[0].args).toEqual([ signs.PAPER ]);
    expect(actions[1].command).toEqual('play');
    actions = getActions(socket2, 2);
    expect(actions[0].command).toEqual('lose');
    expect(actions[0].args).toEqual([ signs.CISSORS ]);
    expect(actions[1].command).toEqual('play');

    // Play LIZARD - SPOCK
    socket1.execute('1', { command: 'play', args: [ signs.LIZARD ] });
    socket2.execute('2', { command: 'play', args: [ signs.SPOCK ] });
    actions = getActions(socket1, 2);
    expect(actions[0].command).toEqual('win');
    expect(actions[0].args).toEqual([ signs.SPOCK ]);
    expect(actions[1].command).toEqual('play');
    actions = getActions(socket2, 2);
    expect(actions[0].command).toEqual('lose');
    expect(actions[0].args).toEqual([ signs.LIZARD ]);
    expect(actions[1].command).toEqual('play');

    // Play SPOCK - ROCK
    socket1.execute('1', { command: 'play', args: [ signs.SPOCK ] });
    socket2.execute('2', { command: 'play', args: [ signs.ROCK ] });
    actions = getActions(socket1, 3);
    expect(actions[0].command).toEqual('win');
    expect(actions[0].args).toEqual([ signs.ROCK ]);
    expect(actions[1].command).toEqual('victory');
    expect(actions[2].command).toEqual('play');
    actions = getActions(socket2, 3);
    expect(actions[0].command).toEqual('lose');
    expect(actions[0].args).toEqual([ signs.SPOCK ]);
    expect(actions[1].command).toEqual('defeat');
    expect(actions[2].command).toEqual('play');
  });

})
