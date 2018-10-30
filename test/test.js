var expect = require('expect.js');

var base = require('../dist/index.js');

describe('Unit test', function() {
    this.timeout(1000);

    describe('module name test', function() {
        it('Name should be TezosSign', function() {
            expect(base.name).to.equal('TezosSign');
        });
    });
});
