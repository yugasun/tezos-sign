import bs58check from 'bs58check';
import bip39 from 'bip39';

const utility = {
    b58cencode(payload, prefix) {
        const n = new Uint8Array(prefix.length + payload.length);
        n.set(prefix);
        n.set(payload, prefix.length);
        return bs58check.encode(Buffer.from(n, 'hex'));
    },
    b58cdecode(enc, prefix) {
        return bs58check.decode(enc).slice(prefix.length);
    },
    buf2hex(buffer) {
        const byteArray = new Uint8Array(buffer);
        const hexParts = [];
        for (let i = 0; i < byteArray.length; i += 1) {
            const hex = byteArray[i].toString(16);
            const paddedHex = `00${hex}`.slice(-2);
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
        const r = new Uint8Array(b1.length + b2.length);
        r.set(b1);
        r.set(b2, b1.length);
        return r;
    },

    generateMnemonic: () => bip39.generateMnemonic(160),
};

export default utility;
