import bs58check from 'bs58check';
import sodium from 'libsodium-wrappers';

const Prefix = {
    edsk: new Uint8Array([43, 246, 78, 7]),
    edsig: new Uint8Array([9, 245, 205, 134, 18]),
};

const Utility = {
    b58cencode(payload, prefix) {
        const n = new Uint8Array(prefix.length + payload.length);
        n.set(prefix);
        n.set(payload, prefix.length);
        return bs58check.encode(new Buffer(n, 'hex'));
    },
    b58cdecode(enc, prefix) {
        return bs58check.decode(enc).slice(prefix.length);
    },
    buf2hex: function(buffer) {
        const byteArray = new Uint8Array(buffer),
            hexParts = [];
        for (let i = 0; i < byteArray.length; i++) {
            let hex = byteArray[i].toString(16);
            let paddedHex = ('00' + hex).slice(-2);
            hexParts.push(paddedHex);
        }
        return hexParts.join('');
    },
    hex2buf(hex) {
        const t = hex.match(/[\da-f]{2}/gi).map(h => parseInt(h, 16));
        const b = new Uint8Array(t);
        return b;
    },
    mergebuf(b1, b2) {
        var r = new Uint8Array(b1.length + b2.length);
        r.set(b1);
        r.set(b2, b1.length);
        return r;
    },
};

/**
 *  tezos offline sign
 *
 * @param {string} bytes operation bytes
 * @param {string} sk private key
 */
export default function TezosSign(bytes, sk) {
    var bb = Utility.hex2buf(bytes);
    var wm = new Uint8Array([3]);
    if (typeof wm != 'undefined') bb = Utility.mergebuf(wm, bb);
    const chash = sodium.crypto_generichash(32, bb);
    const edsk = Utility.b58cdecode(sk, Prefix.edsk);
    const sig = sodium.crypto_sign_detached(chash, edsk, 'uint8array');
    const edsig = Utility.b58cencode(sig, Prefix.edsig);
    const sbytes = bytes + Utility.buf2hex(sig);

    return {
        bytes: bytes,
        sig: sig,
        edsig: edsig,
        sbytes: sbytes,
    };
}
