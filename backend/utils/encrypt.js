const forge = require('node-forge');

const DEFAULT_PASSWORD = '123123';
const PASS_KEY = 'password';
const DEFAULT_PUBLIC_KEY = "-----BEGIN PUBLIC KEY-----\r\nMIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDksIfExnLnHrwMbuUt4mgfcoaQ\r\ny+dqzY03OudJtp2nEoEFi8weEXLBYG2hliZ9ig1fxwpOfLjayZMnwIhYrShoNoLZ\r\nROXJ1xZCeomsBq0C4j7jUqeCUzMTWBBJjq9BB0GvKRDanhEBqbA0s8Ntu2er4ykH\r\nrOgcFeQ32elcJX2gowIDAQAB\r\n-----END PUBLIC KEY-----\r\n"

// 公钥验签
function verifyWithPublicKey(publicKeyPem, data, signature) {
    const publicKey = forge.pki.publicKeyFromPem(publicKeyPem);
    const md = forge.md.sha256.create();
    md.update(data, 'utf8');
    return publicKey.verify(md.digest().bytes(), forge.util.decode64(signature));
}

// 公钥加密
function decryptWithPrivateKey(privateKeyPem, encryptedData) {
    const privateKey = forge.pki.privateKeyFromPem(privateKeyPem);
    const decrypted = privateKey.decrypt(forge.util.decode64(encryptedData));
    return forge.util.decodeUtf8(decrypted);
}

function generateRandomString(length) {
    if(length % 2 !== 0) {
        throw new Error("The length must be an even number.");
    }
    const bytes = forge.random.getBytesSync(length / 2);
    // 将字节转换为十六进制字符串
    return forge.util.bytesToHex(bytes);
}


module.exports = {verifyWithPublicKey, decryptWithPrivateKey, generateRandomString, DEFAULT_PASSWORD, DEFAULT_PUBLIC_KEY,PASS_KEY}

//
// const data = JSON.parse('{"signature":"t1I7K8Kq3WhcaRfcEXO2RdWQWBzlNBjCjxLPeYHzn7PKfbpWY6hznLhGfQocd0o4tGN4fChQ8vdVjaxtI87fbdBZ+4OZri6PoNtC7xkwq1Lp11SpWBEyKW+dsDHzfaKcUaI/9lQsN/cAT5E+K/uYOQLrWcAU7bab3ZyXxkaui06ZTMZn3/4RHsq50MkxSQLnJM7ajB3VrZuYrkQCwj+gUAITuAH2CP8rubkSdJozgoIwxzUqd62nC2p9dUMigN0yogpSQaNXiizlBf78ezGDycQZUtAhCXgFF64aTav2CNdia2LOx+sB25td6zlqIMs694/HjANivTSX5XiwenL8/Q==","data":"{\\"time\\":1722367231799,\\"rnd\\":\\"4ecadc61932330cf\\"}"}');
// const b = verifyWithPublicKey(DEFAULT_PUBLIC_KEY, data.data, data.signature);
// console.log(b);