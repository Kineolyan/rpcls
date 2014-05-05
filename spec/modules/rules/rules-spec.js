var rules = require('rules');

describe('Rules of RPCLS', function() {
  it('has all signs', function() {
    expect(rules.signs.ROCK).toBeDefined();
    expect(rules.signs.PAPER).toBeDefined();
    expect(rules.signs.CISSORS).toBeDefined();
    expect(rules.signs.LIZARD).toBeDefined();
    expect(rules.signs.SPOCK).toBeDefined();
  });

  describe('Rock duels', function() {
    it('makes rock lose against rock', function() {
      expect(rules.play(rules.signs.ROCK, rules.signs.ROCK)).toBe(false);
    });

    it('makes rock lose against paper', function() {
      expect(rules.play(rules.signs.ROCK, rules.signs.PAPER)).toBe(false);
    });

    it('makes rock win against cissors', function() {
      expect(rules.play(rules.signs.ROCK, rules.signs.CISSORS)).toBe(true);
    });

    it('makes rock win against lizard', function() {
      expect(rules.play(rules.signs.ROCK, rules.signs.LIZARD)).toBe(true);
    });

    it('makes rock lose against spock', function() {
      expect(rules.play(rules.signs.ROCK, rules.signs.SPOCK)).toBe(false);
    });
  });

  describe('Paper duels', function() {
    it('makes paper win against rock', function() {
      expect(rules.play(rules.signs.PAPER, rules.signs.ROCK)).toBe(true);
    });

    it('makes paper lose against paper', function() {
      expect(rules.play(rules.signs.PAPER, rules.signs.PAPER)).toBe(false);
    });

    it('makes paper lose against cissors', function() {
      expect(rules.play(rules.signs.PAPER, rules.signs.CISSORS)).toBe(false);
    });

    it('makes paper lose against lizard', function() {
      expect(rules.play(rules.signs.PAPER, rules.signs.LIZARD)).toBe(false);
    });

    it('makes paper win against spock', function() {
      expect(rules.play(rules.signs.PAPER, rules.signs.SPOCK)).toBe(true);
    });
  });

  describe('Cissors duels', function() {
    it('makes cissors lose against rock', function() {
      expect(rules.play(rules.signs.CISSORS, rules.signs.ROCK)).toBe(false);
    });

    it('makes cissors win against paper', function() {
      expect(rules.play(rules.signs.CISSORS, rules.signs.PAPER)).toBe(true);
    });

    it('makes cissors lose against cissors', function() {
      expect(rules.play(rules.signs.CISSORS, rules.signs.CISSORS)).toBe(false);
    });

    it('makes cissors win against lizard', function() {
      expect(rules.play(rules.signs.CISSORS, rules.signs.LIZARD)).toBe(true);
    });

    it('makes cissors lose against spock', function() {
      expect(rules.play(rules.signs.CISSORS, rules.signs.SPOCK)).toBe(false);
    });
  });

  describe('Lizard duels', function() {
    it('makes lizard lose against rock', function() {
      expect(rules.play(rules.signs.LIZARD, rules.signs.ROCK)).toBe(false);
    });

    it('makes lizard win against paper', function() {
      expect(rules.play(rules.signs.LIZARD, rules.signs.PAPER)).toBe(true);
    });

    it('makes lizard lose against cissors', function() {
      expect(rules.play(rules.signs.LIZARD, rules.signs.CISSORS)).toBe(false);
    });

    it('makes lizard lose against lizard', function() {
      expect(rules.play(rules.signs.LIZARD, rules.signs.LIZARD)).toBe(false);
    });

    it('makes lizard win against spock', function() {
      expect(rules.play(rules.signs.LIZARD, rules.signs.SPOCK)).toBe(true);
    });
  });

  describe('Spock duels', function() {
    it('makes spock win against rock', function() {
      expect(rules.play(rules.signs.SPOCK, rules.signs.ROCK)).toBe(true);
    });

    it('makes spock lose against paper', function() {
      expect(rules.play(rules.signs.SPOCK, rules.signs.PAPER)).toBe(false);
    });

    it('makes spock win against cissors', function() {
      expect(rules.play(rules.signs.SPOCK, rules.signs.CISSORS)).toBe(true);
    });

    it('makes spock lose against lizard', function() {
      expect(rules.play(rules.signs.SPOCK, rules.signs.LIZARD)).toBe(false);
    });

    it('makes spock lose against spock', function() {
      expect(rules.play(rules.signs.SPOCK, rules.signs.SPOCK)).toBe(false);
    });
  });

});
