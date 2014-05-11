var client = require('rpcls/client');
var signs = require('rpcls/rules').signs;
var msg = require('rpcls/message');

function voidFunction() {}

describe('Client module', function() {

  describe('Client state machine', function() {

    beforeEach(function() {
      this.socket = {
	write: voidFunction,
        actions: [],
        on: function(key, action) {
          if (key == 'data') this.actions.push(action);
        },
        execute: function(message) {
          for (var actionIndex in this.actions) {
            this.actions[actionIndex].call(this, message);
          }
        }
      };

      this.manager = {
          createGame: null
	, joinGame: null
      };
      spyOn(this.manager, 'createGame');
      spyOn(this.manager, 'joinGame');
    });

    describe('at start', function() {

      beforeEach(function() {
	this.client = new client.Client(this.manager, this.socket, 42);
        spyOn(this.client, 'sendError');
      });

      it('accept create action at start', function() {
        this.socket.execute(msg.encode('client', { command: 'create' }));
        expect(this.manager.createGame).toHaveBeenCalledWith(this.client);
        expect(this.client.sendError).not.toHaveBeenCalled();
//        this.socket.execute(msg.encode('client', { command: 'create' }));
//        expect(this.client.sendError).toHaveBeenCalled();
      });

      it('accepts join action at start', function() {
	var gameId = 12;

        this.socket.execute(msg.encode('client', { command: 'join', args: [ gameId ] }));
        expect(this.manager.joinGame).toHaveBeenCalledWith(gameId, this.client);
        expect(this.client.sendError).not.toHaveBeenCalled();
//        this.socket.execute(msg.encode('client', { command: 'create' }));
//        expect(this.client.sendError).toHaveBeenCalled();
      });

      it('rejects all actions but create/join', function() {
        this.socket.execute(msg.encode({ command: 'play' }));	      
        this.socket.execute(msg.encode({ command: 'test' }));	      
        this.socket.execute(msg.encode({ command: 'welcome' }));	      

	expect(this.client.sendError.calls.length).toEqual(3);
      });

    });

    describe('when connected to a game', function() {

      beforeEach(function() {
	this.client = new client.Client(this.manager, this.socket, 42);
        spyOn(this.client, 'sendError');

	this.referee = {
	  play: voidFunction
        };
	spyOn(this.referee, 'play');
	this.client.referee = this.referee;
      });

      it('plays after creating a game', function() {
	this.socket.execute(msg.encode('client', { command: 'create' }));

        this.client.askToPlay();
	this.socket.execute(msg.encode('client', { command: 'play', args: [ signs.ROCK ] }));

        expect(this.client.sendError).not.toHaveBeenCalled();
	expect(this.referee.play).toHaveBeenCalledWith(this.client, signs.ROCK);
      });

      it('plays after joining a game'), function() {
	this.socket.execute(msg.encode('client', { command: 'join', args: [ 1234 ] }));

        this.client.askToPlay();
	this.socket.execute(msg.encode('client', { command: 'play', args: [ signs.ROCK ] }));

        expect(this.client.sendError).not.toHaveBeenCalled();
	expect(this.referee.play).toHaveBeenCalledWith(this.client, signs.ROCK);
      };

      it('only accepts sign if asked', function() {
	this.socket.execute(msg.encode('client', { command: 'create' }));

        // do not ask to play
	this.socket.execute(msg.encode('client', { command: 'play', args: [ signs.ROCK ] }));
	expect(this.client.sendError).toHaveBeenCalled();

	// ask this time but do not play twice
	this.client.askToPlay();
	this.socket.execute(msg.encode('client', { command: 'play', args: [ signs.ROCK ] }));
	expect(this.client.sendError.calls.length).toEqual(1);

	this.socket.execute(msg.encode('client', { command: 'play', args: [ signs.ROCK ] }));
	expect(this.client.sendError.calls.length).toEqual(2);
      });

      it('rejects all actions but play', function() {
	this.socket.execute(msg.encode('client', { command: 'create' }));

        this.socket.execute(msg.encode('client', { command: 'create' }));
        this.socket.execute(msg.encode('client', { command: 'join', args: [ 12 ] }));
        this.socket.execute(msg.encode('client', { command: 'hello' }));
	expect(this.client.sendError.calls.length).toEqual(3);
      });

    });

  });

  describe('Client messages', function() {

    beforeEach(function() {
      this.socket = { write: null, on: voidFunction };
      spyOn(this.socket, 'write');

      this.client = new client.Client(null, this.socket, 42);
    });

    it('sends client in on creation', function() {
      var expectMessage = msg.encode('Server', { command: 'id', args: [ 42 ] });
      expect(this.socket.write.mostRecentCall.args).toEqual([ expectMessage ]);
    });

    it('notifies on game creation', function() {
      this.client.gameCreated(1234);

      var expectedmessage = msg.encode('Server', { command: 'game', args: [ 1234 ] });
      expect(this.socket.write.mostRecentCall.args).toEqual([ expectedmessage ]);
    });

    it('notifies on game connection', function() {
      this.client.gameJoined();

      var expectedmessage = msg.encode('Server', { command: 'joined' });
      expect(this.socket.write.mostRecentCall.args).toEqual([ expectedmessage ]);
    });

    it('ask client to play', function() {
      this.client.askToPlay();

      var expectedMessage = msg.encode('Server', { command: 'play' });
      expect(this.socket.write.mostRecentCall.args).toEqual([ expectedMessage ]);
    });

    it('send client the result of a set', function() {
      this.client.winSet(signs.ROCK);
      var expectedMessage = msg.encode('Server', { command: 'win', args: [ signs.ROCK ] });
      expect(this.socket.write.mostRecentCall.args).toEqual([ expectedMessage ]);

      this.client.loseSet(signs.ROCK);
      var expectedMessage = msg.encode('Server', { command: 'lose', args: [ signs.ROCK ] });
      expect(this.socket.write.mostRecentCall.args).toEqual([ expectedMessage ]);

      this.client.deuce();
      var expectedMessage = msg.encode('Server', { command: 'deuce' });
      expect(this.socket.write.mostRecentCall.args).toEqual([ expectedMessage ]);
    });

    it('notifies client of victory', function() {
      this.client.win();

      var expectedMessage = msg.encode('Server', { command: 'victory' });
      expect(this.socket.write.mostRecentCall.args).toEqual([ expectedMessage ]);
    });

    it('notifies client of defeat', function() {
      this.client.lose();

      var expectedMessage = msg.encode('Server', { command: 'defeat' });
      expect(this.socket.write.mostRecentCall.args).toEqual([ expectedMessage ]);
    });

    it('sends errors', function() {
      var error = 'This is a mistake';
      this.client.sendError(error);

      var expectedMessage = msg.encode('Server', { command: 'error', args: [ error ] });
      expect(this.socket.write.mostRecentCall.args).toEqual([ expectedMessage ]);
    });

  });

});
