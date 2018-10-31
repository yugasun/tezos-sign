var expect = require('expect.js');

var TezosSign = require('../dist/index.js');

describe('Unit test', function() {
    this.timeout(1000);

    describe('Sign', function() {
        it('Should has sign function', function() {
            expect(typeof TezosSign.sign).to.equal('function');
        });
    });

    describe('Generate keys', function() {
        it('result validate', function() {
            const keys = TezosSign.generateKeys('yugasun');
            expect(keys.passphrase).to.equal('yugasun');
        });
    });

    describe('Extract private key', function() {
        it('Need return address', function() {
            const keys = TezosSign.generateKeys('yugasun');

            const extractKeys = TezosSign.extractKeys(keys.sk);

            expect(keys.pkh).to.equal(extractKeys.pkh);
        });
    });
});
