var signs = require('rpcls/rules').signs;
var referee = require('rpcls/referee');

function voidFunction() {}

function MockPlayer() {}
MockPlayer.prototype = {
  gameCreated: voidFunction,
  gameJoined: voidFunction,
  askToPlay: voidFunction,
  winSet: voidFunction,
  loseSet: voidFunction,
  deuce: voidFunction,
  win: voidFunction,
  lose: voidFunction,
  endGame: voidFunction
};

// { [Function]
//   identity: 'gameCreated',
//   isSpy: true,
//   plan: [Function],
//   mostRecentCall: 
//    { object: { gameCreated: [Circular], referee: [Object] },
//      args: [ 0 ] },
//   argsForCall: [ [ 0 ] ],
//   calls: [ { object: [Object], args: [Object] } ],
//   andCallThrough: [Function],
//   andReturn: [Function],
//   andThrow: [Function],
//   andCallFake: [Function],
//   reset: [Function],
//   wasCalled: true,
//   callCount: 1,
//   baseObj: 
//    { gameCreated: [Circular],
//      referee: { gameId: 0, sign1: null, sign2: null, player1: [Circular] } },
//   methodName: 'gameCreated',
//   originalValue: [Function: voidFunction] }

describe('Referee module', function() {

  beforeEach(function() {
    this.gameId = 0;
    this.referee = new referee.Referee(this.gameId, 3);
    this.player1 = new MockPlayer;
    this.player2 = new MockPlayer();
  });

  it('creates properly a Referee', function() {
    expect(this.referee.gameId).toEqual(this.gameId);
  });

  it('notifies player1 that the game is created', function() {
    spyOn(this.player1, 'gameCreated');
    this.referee.setPlayer1(this.player1);
    expect(this.player1.gameCreated).toHaveBeenCalledWith(this.gameId);
    expect(this.player1.gameCreated.calls.length).toEqual(1);
  });

  it('notifies player2 that he has joined the game', function() {
    this.referee.setPlayer1(this.player1);

    spyOn(this.player2, 'gameJoined');

    this.referee.setPlayer2(this.player2);
    expect(this.player2.gameJoined).toHaveBeenCalled();
    expect(this.player2.gameJoined.calls.length).toEqual(1);
  });

  it('asks for players a sign when the game starts', function() {
    this.referee.setPlayer1(this.player1);
    this.referee.setPlayer2(this.player2);

    spyOn(this.player1, 'askToPlay');
    spyOn(this.player2, 'askToPlay');
    this.referee.startGame();
    expect(this.player1.askToPlay.calls.length).toEqual(1);
    expect(this.player2.askToPlay.calls.length).toEqual(1);
  }); 

  it('plays a set with win of player1', function() {
    this.referee.setPlayer1(this.player1);
    this.referee.setPlayer2(this.player2);
    this.referee.startGame();

    spyOn(this.player1, 'winSet');
    spyOn(this.player2, 'winSet');
    spyOn(this.player1, 'loseSet');
    spyOn(this.player2, 'loseSet');
    spyOn(this.player1, 'deuce');
    spyOn(this.player2, 'deuce');

    this.referee.play(this.player1, signs.ROCK);
    expect(this.player1.winSet).not.toHaveBeenCalled();
    expect(this.player2.winSet).not.toHaveBeenCalled();
    expect(this.player1.loseSet).not.toHaveBeenCalled();
    expect(this.player2.loseSet).not.toHaveBeenCalled();
    expect(this.player1.deuce).not.toHaveBeenCalled();
    expect(this.player2.deuce).not.toHaveBeenCalled();
    expect(this.player1.score).toEqual(0);
    expect(this.player2.score).toEqual(0);

    spyOn(this.player1, 'askToPlay');
    spyOn(this.player2, 'askToPlay');

    this.referee.play(this.player2, signs.CISSORS);
    expect(this.player1.winSet).toHaveBeenCalled();
    expect(this.player2.winSet).not.toHaveBeenCalled();
    expect(this.player1.loseSet).not.toHaveBeenCalled();
    expect(this.player2.loseSet).toHaveBeenCalled();
    expect(this.player1.deuce).not.toHaveBeenCalled();
    expect(this.player2.deuce).not.toHaveBeenCalled();
    expect(this.player1.score).toEqual(1);
    expect(this.player2.score).toEqual(0);

    expect(this.player1.askToPlay.calls.length).toEqual(1);
    expect(this.player2.askToPlay.calls.length).toEqual(1);
  });

  it('plays a se with a deuce', function() {
    this.referee.setPlayer1(this.player1);
    this.referee.setPlayer2(this.player2);
    this.referee.startGame();

    spyOn(this.player1, 'winSet');
    spyOn(this.player2, 'winSet');
    spyOn(this.player1, 'loseSet');
    spyOn(this.player2, 'loseSet');
    spyOn(this.player1, 'deuce');
    spyOn(this.player2, 'deuce');

    this.referee.play(this.player1, signs.ROCK);
    expect(this.player1.winSet).not.toHaveBeenCalled();
    expect(this.player2.winSet).not.toHaveBeenCalled();
    expect(this.player1.loseSet).not.toHaveBeenCalled();
    expect(this.player2.loseSet).not.toHaveBeenCalled();
    expect(this.player1.deuce).not.toHaveBeenCalled();
    expect(this.player2.deuce).not.toHaveBeenCalled();
    expect(this.player1.score).toEqual(0);
    expect(this.player2.score).toEqual(0);

    spyOn(this.player1, 'askToPlay');
    spyOn(this.player2, 'askToPlay');

    this.referee.play(this.player2, signs.ROCK);
    expect(this.player1.winSet).not.toHaveBeenCalled();
    expect(this.player2.winSet).not.toHaveBeenCalled();
    expect(this.player1.loseSet).not.toHaveBeenCalled();
    expect(this.player2.loseSet).not.toHaveBeenCalled();
    expect(this.player1.deuce).toHaveBeenCalled();
    expect(this.player2.deuce).toHaveBeenCalled();
    expect(this.player1.score).toEqual(0);
    expect(this.player2.score).toEqual(0);

    expect(this.player1.askToPlay.calls.length).toEqual(1);
    expect(this.player2.askToPlay.calls.length).toEqual(1);
  });

  it('manages a complete game', function() {
    this.referee.setPlayer1(this.player1);
    this.referee.setPlayer2(this.player2);
    this.referee.startGame();

    this.referee.play(this.player1, signs.ROCK);
    this.referee.play(this.player2, signs.CISSORS);
    expect(this.player1.score).toEqual(1);
    expect(this.player2.score).toEqual(0);

    this.referee.play(this.player1, signs.PAPER);
    this.referee.play(this.player2, signs.CISSORS);
    expect(this.player1.score).toEqual(1);
    expect(this.player2.score).toEqual(1);

    this.referee.play(this.player1, signs.CISSORS);
    this.referee.play(this.player2, signs.CISSORS);
    expect(this.player1.score).toEqual(1);
    expect(this.player2.score).toEqual(1);

    this.referee.play(this.player1, signs.ROCK);
    this.referee.play(this.player2, signs.CISSORS);
    expect(this.player1.score).toEqual(2);
    expect(this.player2.score).toEqual(1);
     
    spyOn(this.player1, 'win');
    spyOn(this.player2, 'win');
    spyOn(this.player1, 'lose');
    spyOn(this.player2, 'lose');
    spyOn(this.player1, 'winSet');
    spyOn(this.player2, 'winSet');
    spyOn(this.player1, 'loseSet');
    spyOn(this.player2, 'loseSet');
    spyOn(this.player1, 'deuce');
    spyOn(this.player2, 'deuce');
    spyOn(this.player1, 'askToPlay');
    spyOn(this.player2, 'askToPlay');

    this.referee.play(this.player1, signs.SPOCK);
    this.referee.play(this.player2, signs.CISSORS);
    expect(this.player1.win).toHaveBeenCalled();
    expect(this.player2.win).not.toHaveBeenCalled();
    expect(this.player1.lose).not.toHaveBeenCalled();
    expect(this.player2.lose).toHaveBeenCalled();

    expect(this.player1.winSet).toHaveBeenCalled();
    expect(this.player2.winSet).not.toHaveBeenCalled();
    expect(this.player1.loseSet).not.toHaveBeenCalled();
    expect(this.player2.loseSet).toHaveBeenCalled();
    expect(this.player1.deuce).not.toHaveBeenCalled();
    expect(this.player2.deuce).not.toHaveBeenCalled();

    expect(this.player1.score).toEqual(3);
    expect(this.player2.score).toEqual(1);

    expect(this.player1.askToPlay.calls.length).toEqual(1);
    expect(this.player2.askToPlay.calls.length).toEqual(1);
  });

  it('ends a game', function() {
    this.referee.setPlayer1(this.player1);
    this.referee.setPlayer2(this.player2);
    this.referee.startGame();

    spyOn(this.player1, 'endGame');
    spyOn(this.player2, 'endGame');
    this.referee.end();

    expect(this.player1.endGame).toHaveBeenCalled();
    expect(this.player2.endGame).toHaveBeenCalled();
  });

});
