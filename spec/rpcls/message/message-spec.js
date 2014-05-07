var msg = require('rpcls/message');

describe('Message module', function() {

  describe('Message encoding', function() {

    it('encodes message witout action', function() {
      var message = msg.encode('Server');

      expect(message).toEqual('[Server];');
    });

    it('encodes message with one action and no parameter', function() {
      var message = msg.encode('Server', { command: 'greet' });

      expect(message).toEqual('[Server]greet;');
    });

    it('encodes message with one action and parameters', function() {
      var message = msg.encode('Server'
        , { command: 'greet', args: [1, 'a'] });

      expect(message).toEqual('[Server]greet:1:a;');
    });

    it('encodes message with multiple actions and parameters', function() {
      var message = msg.encode('Server'
        , { command: 'greet', args: [1, 'a'] }
        , { command: 'talk' }
        , { command: 'salute', args: ['bye'] });

      expect(message).toEqual('[Server]greet:1:a|talk|salute:bye;');
    });

  });

  describe('Message decoding', function() {

    it('decodes message without action', function() {
      var messages = msg.decode('[Server];');
      expect(messages.length).toBe(1);

      var message = messages[0];
      expect(message.sender).toEqual('Server');

      expect(message.actions).toBeDefined();
      expect(message.actions.length).toEqual(0);
    });

    it('decodes message with one action and no parameter', function() {
      var messages = msg.decode('[Server]greet;');
      expect(messages.length).toBe(1);

      var message = messages[0];
      expect(message.sender).toEqual('Server');

      expect(message.actions.length).toBe(1);

      var action = message.actions[0];
      expect(action.command).toEqual('greet');
      expect(action.args.length).toBe(0);
    });

    it('decodes message with one action and parameters', function() {
      var messages = msg.decode('[Server]greet:1:a;');
      expect(messages.length).toBe(1);

      var message = messages[0];
      expect(message.sender).toEqual('Server');

      expect(message.actions.length).toBe(1);

      var action = message.actions[0];
      expect(action.command).toEqual('greet');
      expect(action.args).toEqual([1, 'a']);
    });

    it('decodes message with multiple actions', function() {
      var messages = msg.decode('[Server]greet:1:a|talk|salute:bye;');
      expect(messages.length).toBe(1);

      var message = messages[0];
      expect(message.sender).toEqual('Server');

      expect(message.actions.length).toBe(3);

      var action1 = message.actions[0];
      expect(action1.command).toEqual('greet');
      expect(action1.args).toEqual([1, 'a']);

      var action2 = message.actions[1];
      expect(action2.command).toEqual('talk');
      expect(action2.args).toEqual([]);

      var action3 = message.actions[2];
      expect(action3.command).toEqual('salute');
      expect(action3.args).toEqual(['bye']);
    });

    it('decodes multiples messages', function() {
      var messages = msg.decode('[Server]greet:hello;[Client]answer:hey|salute:bye;[Server]end;');

      expect(messages.length).toEqual(3);

      var message1 = messages[0];
      expect(message1.sender).toEqual('Server');
      expect(message1.actions.length).toEqual(1);
      var action11 = message1.actions[0];
      expect(action11.command).toEqual('greet');
      expect(action11.args).toEqual(['hello']);

      var message2 = messages[1];
      expect(message2.sender).toEqual('Client');
      expect(message2.actions.length).toEqual(2);
      var action21 = message2.actions[0];
      expect(action21.command).toEqual('answer');
      expect(action21.args).toEqual(['hey']);
      var action22 = message2.actions[1];
      expect(action22.command).toEqual('salute');
      expect(action22.args).toEqual(['bye']);

      var message3 = messages[2];
      expect(message3.sender).toEqual('Server');
      expect(message3.actions.length).toEqual(1);
      var action31 = message3.actions[0];
      expect(action31.command).toEqual('end');
      expect(action31.args).toEqual([]);
    });

  });

});
