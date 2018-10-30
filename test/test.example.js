var expect = require('expect.js');

var TezosSign = require('../dist/index.js');

// this is operatin bytes
var opbypes =
    'tezos operation bytes';

// this is private key
var privateKey =
    'private key';

describe('Sign test', function() {

    describe('TezosSign function', function() {
        it('Sign output', function() {
            const signed = TezosSign(opbypes, privateKey);
            
            expect(signed.bytes).to.equal(opbypes);
        });
    });

});
