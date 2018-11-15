import bs58check from 'bs58check';
import sodium from 'libsodium-wrappers';
import bip39 from 'bip39';

const Prefix = {
    tz1: new Uint8Array([6, 161, 159]),
    edsk: new Uint8Array([43, 246, 78, 7]),
    edsk2: new Uint8Array([13, 15, 58, 7]),
    edpk: new Uint8Array([13, 15, 37, 217]),
    edsig: new Uint8Array([9, 245, 205, 134, 18]),
    o: new Uint8Array([5, 116]),
};

const Utility = {
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

const TezosSign = {
    /**
     * generate keys
     *
     * @param {string} name passphrase
     * @return {object}
     */
    generateKeys(name) {
        try {
            const m = Utility.generateMnemonic();
            const s = bip39.mnemonicToSeed(m, name).slice(0, 32);
            const kp = sodium.crypto_sign_seed_keypair(s);

            const sk = Utility.b58cencode(kp.privateKey, Prefix.edsk);
            const pk = Utility.b58cencode(kp.publicKey, Prefix.edpk);
            const hash = sodium.crypto_generichash(20, kp.publicKey);
            const pkh = Utility.b58cencode(hash, Prefix.tz1);

            return {
                mnemonic: m,
                passphrase: name,
                sk,
                pk,
                pkh,
            };
        } catch (e) {
            throw new Error(`Generate failed: ${e.message}`);
        }
    },

    /**
     * generate keys without seed
     *
     * @return {object}
     */
    generateKeysNoSeed() {
        try {
            const kp = sodium.crypto_sign_keypair();

            const sk = Utility.b58cencode(kp.privateKey, Prefix.edsk);
            const pk = Utility.b58cencode(kp.publicKey, Prefix.edpk);
            const hash = sodium.crypto_generichash(20, kp.publicKey);
            const pkh = Utility.b58cencode(hash, Prefix.tz1);
            return {
                sk,
                pk,
                pkh,
            };
        } catch (e) {
            throw new Error(`Generate failed: ${e.message}`);
        }
    },

    /**
     * extract keys
     *
     * @param {string} sk private key
     * @return {object}
     */
    extractKeys(sk) {
        try {
            const pref = sk.substr(0, 4);
            switch (pref) {
                case 'edsk':
                    if (sk.length === 98) {
                        const decodeEdsk = Utility.b58cdecode(
                            sk,
                            Prefix.edsk,
                        ).slice(32);

                        const pk = Utility.b58cencode(decodeEdsk, Prefix.edpk);
                        const hash = sodium.crypto_generichash(20, decodeEdsk);

                        const pkh = Utility.b58cencode(hash, Prefix.tz1);
                        return {
                            pk,
                            pkh,
                            sk,
                        };
                    }
                    if (sk.length === 54) {
                        // seed
                        const s = Utility.b58cdecode(sk, Prefix.edsk2);
                        const kp = sodium.crypto_sign_seed_keypair(s);
                        const hash = sodium.crypto_generichash(20, kp.publicKey);

                        const sk1 = Utility.b58cencode(kp.privateKey, Prefix.edsk);
                        const pk = Utility.b58cencode(kp.publicKey, Prefix.edpk);
                        const pkh = Utility.b58cencode(hash, Prefix.tz1);
                        return {
                            sk: sk1,
                            pk,
                            pkh,
                        };
                    }
                    break;
                default:
                    return false;
            }
        } catch (e) {
            throw new Error(`Extract private key failed: ${e.message}`);
        }
    },

    /**
     *  tezos offline sign
     *
     * @param {string} bytes operation bytes
     * @param {string} sk private key
     * @return {object}
     */
    sign(bytes, sk) {
        try {
            let bb = Utility.hex2buf(bytes);
            const wm = new Uint8Array([3]);
            if (typeof wm !== 'undefined') bb = Utility.mergebuf(wm, bb);
            const chash = sodium.crypto_generichash(32, bb);
            const edsk = Utility.b58cdecode(sk, Prefix.edsk);
            const sig = sodium.crypto_sign_detached(chash, edsk, 'uint8array');
            const edsig = Utility.b58cencode(sig, Prefix.edsig);
            const sbytes = bytes + Utility.buf2hex(sig);

            return {
                bytes,
                sig,
                edsig,
                sbytes,
            };
        } catch (e) {
            throw new Error(`Sign failed: ${e.message}`);
        }
    },

    /**
     * validate address
     *
     * @param {string} a address
     * @return {bool}
     */
    checkAddress(a) {
        try {
            Utility.b58cdecode(a, Prefix.tz1);
            return true;
        } catch (e) {
            return false;
        }
    },

    /**
     * generate tx hash
     *
     * @param {string} sbytes signed op bytes
     * @return {string}
     */
    generateTxHash(sbytes) {
        try {
            const hexBuffer = Utility.hex2buf(sbytes);
            const soHash = sodium.crypto_generichash(32, hexBuffer);
            const hash = Utility.b58cencode(soHash, Prefix.o);
            return hash;
        } catch (e) {
            throw new Error(`Generate transaction hash failed: ${e.message}`);
        }
    },
};

export default TezosSign;
