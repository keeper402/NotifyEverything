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
function encryptWithPublicKey(publicKeyPem, data) {
    const publicKey = forge.pki.publicKeyFromPem(publicKeyPem);
    const encrypted = publicKey.encrypt(forge.util.encodeUtf8(data));
    return forge.util.encode64(encrypted);
}

function generateRandomString(length) {
    if(length % 2 !== 0) {
        throw new Error("The length must be an even number.");
    }
    const bytes = forge.random.getBytesSync(length / 2);
    // 将字节转换为十六进制字符串
    return forge.util.bytesToHex(bytes);
}

function encryptByAES(rawText, aesKey) {
    // 生成随机 IV 12 字节
    const iv = forge.random.getBytesSync(12);
    // 生成 AES-GCM 模式的 cipher 对象并传入密钥
    const cipher = forge.cipher.createCipher('AES-GCM', forge.util.createBuffer(aesKey, 'raw'));
    cipher.start({ iv: forge.util.createBuffer(iv) });
    cipher.update(forge.util.createBuffer(forge.util.encodeUtf8(rawText)));
    cipher.finish();

    const encrypted = cipher.output.getBytes();
    const tag = cipher.mode.tag.getBytes();

    return {
        iv: forge.util.encode64(iv),
        encrypted: forge.util.encode64(encrypted),
        tag: forge.util.encode64(tag),
    };
}
function decryptByAES(encrypted, aesKey) {
    const iv = forge.util.decode64(encrypted.iv);
    const tag = forge.util.decode64(encrypted.tag);
    const data = forge.util.decode64(encrypted.encrypted);

    const decipher = forge.cipher.createDecipher('AES-GCM', forge.util.createBuffer(aesKey, 'raw'));
    decipher.start({ iv: forge.util.createBuffer(iv), tag: forge.util.createBuffer(tag) });
    decipher.update(forge.util.createBuffer(data));

    const pass = decipher.finish();
    return pass ? forge.util.decodeUtf8(decipher.output.getBytes()) : null; // 检查解密是否成功
}

function calculateMD5(data) {
    // 创建 MD5 哈希对象
    const md = forge.md.md5.create();
    // 更新哈希对象
    md.update(data);
    // 返回十六进制格式的哈希值
    return md.digest().toHex();
}

module.exports = {verifyWithPublicKey, encryptByAES, decryptByAES, generateRandomString, calculateMD5, DEFAULT_PASSWORD, DEFAULT_PUBLIC_KEY,PASS_KEY}

//
// const data = JSON.parse('{"signature":"t1I7K8Kq3WhcaRfcEXO2RdWQWBzlNBjCjxLPeYHzn7PKfbpWY6hznLhGfQocd0o4tGN4fChQ8vdVjaxtI87fbdBZ+4OZri6PoNtC7xkwq1Lp11SpWBEyKW+dsDHzfaKcUaI/9lQsN/cAT5E+K/uYOQLrWcAU7bab3ZyXxkaui06ZTMZn3/4RHsq50MkxSQLnJM7ajB3VrZuYrkQCwj+gUAITuAH2CP8rubkSdJozgoIwxzUqd62nC2p9dUMigN0yogpSQaNXiizlBf78ezGDycQZUtAhCXgFF64aTav2CNdia2LOx+sB25td6zlqIMs694/HjANivTSX5XiwenL8/Q==","data":"{\\"time\\":1722367231799,\\"rnd\\":\\"4ecadc61932330cf\\"}"}');
// const b = verifyWithPublicKey(DEFAULT_PUBLIC_KEY, data.data, data.signature);
// console.log(b);