const expect = require('expect.js');
const TezosSign = require('../dist/index.js');

describe('Unit test', function() {
    this.timeout(1000);

    describe('Sign', function() {
        it('Should has sign function', function() {
            expect(typeof TezosSign.sign).to.equal('function');
        });
    });

    describe('Generate tx hash', function() {
        it('Should return transaction hash', function() {
            const opbytes = '4d83f21de34982e553c9e21b81ca5b9ab66e392bcf17e8a3325d419fe53a60a108000026d5205e31d886ff54bff8c36050fbfc3ab80f02018fff10c80100e80700005cc64c23e4b0642d094f8ee39193d18c8dc3a02c00cb470b92f5c3e45210e98a21589a896c830c9b11603427c7d160e99308368d1ae9525f4359aeedf922384fabf8b7a70908d443df4cd62a6df4d385e61fc6ff09';
            const hash = TezosSign.generateTxHash(opbytes);
            expect(typeof hash).to.equal('string');
            expect(hash.length).to.equal(51);
        });
    });

    describe('Generate keys', function() {
        it('result validate', function() {
            const keys = TezosSign.generateKeys('yugasun');
            expect(keys.passphrase).to.equal('yugasun');
        });
    });

    describe('Generate keys without seed', function() {
        it('result validate', function() {
            const keys = TezosSign.generateKeys('yugasun');
            const validateAddr = TezosSign.checkAddress(keys.pkh);
            expect(validateAddr).to.equal(true);
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
