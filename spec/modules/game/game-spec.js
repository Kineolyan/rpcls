var game = require('game');
var rules = require('rules');

describe('Game module', function() {

  it('create Game with 2 players', function() {
    var newGame = new game.Game({ name: 'Olivier' }, { name: 'Reivilo' }, 3);

    expect(newGame.player1).toBeDefined();
    expect(newGame.player1.name).toBe('Olivier');

    expect(newGame.player2).toBeDefined();
    expect(newGame.player2.name).toBe('Reivilo');

    expect(newGame.player1.score).toBe(0);
    expect(newGame.player2.score).toBe(0);
    expect(newGame.turns).toBe(0);
  });

  describe('Game actions', function() {

    beforeEach(function() {
      this.newGame = new game.Game({ name: 'Olivier' }, { name: 'Reivilo' }, 3);
    });

    it('counts turns', function() {
      this.newGame.play(rules.signs.ROCK, rules.signs.CISSORS);
      expect(this.newGame.turns).toBe(1);

      this.newGame.play(rules.signs.ROCK, rules.signs.CISSORS);
      expect(this.newGame.turns).toBe(2);

      this.newGame.play(rules.signs.ROCK, rules.signs.CISSORS);
      expect(this.newGame.turns).toBe(3);

      this.newGame.play(rules.signs.ROCK, rules.signs.CISSORS);
      expect(this.newGame.turns).toBe(4);
    });

    it('makes player1 score 1 point', function() {
      this.newGame.play(rules.signs.ROCK, rules.signs.CISSORS);

      expect(this.newGame.player1.score).toBe(1);
      expect(this.newGame.player2.score).toBe(0);
    });

    it('makes player2 score 1 point', function() {
      this.newGame.play(rules.signs.PAPER, rules.signs.CISSORS);

      expect(this.newGame.player1.score).toBe(0);
      expect(this.newGame.player2.score).toBe(1);
    });

    it('accepts deuce', function() {
      this.newGame.play(rules.signs.PAPER, rules.signs.PAPER);

      expect(this.newGame.player1.score).toBe(0);
      expect(this.newGame.player2.score).toBe(0);
    });

  });

  describe('Game victories without limit', function() {

    beforeEach(function() {
      this.game = new game.Game({ name: 'Olivier' }, { name: 'Reivilo' }, 2);
    });

    it('makes player1 wins', function() {
      expect(this.game.hasWinner()).toBe(false);

      this.game.play(rules.signs.ROCK, rules.signs.CISSORS);
      expect(this.game.hasWinner()).toBe(false);

      this.game.play(rules.signs.PAPER, rules.signs.CISSORS);
      expect(this.game.hasWinner()).toBe(false);

      this.game.play(rules.signs.ROCK, rules.signs.CISSORS);
      expect(this.game.hasWinner()).toBe(true);
      expect(this.game.winner).toEqual(this.game.player1);
      expect(this.game.loser).toEqual(this.game.player2);
    });

    it('makes player2 wins', function() {
      expect(this.game.hasWinner()).toBe(false);

      this.game.play(rules.signs.ROCK, rules.signs.CISSORS);
      expect(this.game.hasWinner()).toBe(false);

      this.game.play(rules.signs.PAPER, rules.signs.CISSORS);
      expect(this.game.hasWinner()).toBe(false);

      this.game.play(rules.signs.ROCK, rules.signs.SPOCK);
      expect(this.game.hasWinner()).toBe(true);
      expect(this.game.winner).toEqual(this.game.player2);
      expect(this.game.loser).toEqual(this.game.player1);
    });

  });

  describe('Game victories with limit', function() {

    beforeEach(function() {
      this.game = new game.Game({ name: 'Olivier' }, { name: 'Reivilo' }, 9, 3);
    });

    it('makes player1 wins', function() {
      expect(this.game.hasWinner()).toBe(false);

      this.game.play(rules.signs.ROCK, rules.signs.CISSORS);
      expect(this.game.hasWinner()).toBe(false);

      this.game.play(rules.signs.PAPER, rules.signs.CISSORS);
      expect(this.game.hasWinner()).toBe(false);

      this.game.play(rules.signs.CISSORS, rules.signs.CISSORS);
      expect(this.game.hasWinner()).toBe(false);

      this.game.play(rules.signs.LIZARD, rules.signs.SPOCK);
      expect(this.game.hasWinner()).toBe(true);
      expect(this.game.winner).toEqual(this.game.player1);
      expect(this.game.loser).toEqual(this.game.player2);
    });

    it('makes player2 wins', function() {
      expect(this.game.hasWinner()).toBe(false);

      this.game.play(rules.signs.ROCK, rules.signs.CISSORS);
      expect(this.game.hasWinner()).toBe(false);

      this.game.play(rules.signs.PAPER, rules.signs.CISSORS);
      expect(this.game.hasWinner()).toBe(false);

      this.game.play(rules.signs.CISSORS, rules.signs.CISSORS);
      expect(this.game.hasWinner()).toBe(false);

      this.game.play(rules.signs.LIZARD, rules.signs.ROCK);
      expect(this.game.hasWinner()).toBe(true);
      expect(this.game.winner).toEqual(this.game.player2);
      expect(this.game.loser).toEqual(this.game.player1);
    });

  });

  it('can continue the game after victory', function() {
    var newGame = new game.Game({ name: 'Olivier' }, { name: 'Reivilo' }, 1);

    newGame.play(rules.signs.ROCK, rules.signs.CISSORS);
    expect(newGame.hasWinner()).toBe(true);

    newGame.play(rules.signs.LIZARD, rules.signs.CISSORS); 
    newGame.play(rules.signs.LIZARD, rules.signs.CISSORS); 
    newGame.play(rules.signs.LIZARD, rules.signs.CISSORS); 
    newGame.play(rules.signs.LIZARD, rules.signs.CISSORS); 
    expect(newGame.winner).toEqual(newGame.player1);
    expect(newGame.loser).toEqual(newGame.player2);
  });

}); 
