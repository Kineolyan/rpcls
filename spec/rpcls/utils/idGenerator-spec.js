var utils = require('rpcls/utils');

describe('Id generator', function() {

  it('generates unique ids', function() {
    var generator = utils.idGenerator();

    var values = [];
    for (var i = 0; i < 50; ++i) {
      values.push(generator());
    }

    for (var i = 0; i < values.length - 1; ++i) {
      for (var j = i + 1; j < values.length; ++j) {
        expect(values[i]).not.toEqual(values[j]);
      }
    }
  });

});
