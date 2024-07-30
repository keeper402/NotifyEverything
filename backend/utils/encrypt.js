const forge = require('node-forge');

const DEFAULT_PASSWORD = '123123';
const DEFAULT_PUBLIC_KEY = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA5LCHxMZy5x68DG7lLeJo
H3KGkMvnas2NNzrnSbadpxKBBYvMHhFywWBtoZYmfYoNX8cKTny42smTJ8CIWK0m
4FkIPUqegA1/VjGSaQHTKS2W4UiC8eE2/f0KmRQogxPcNBgla9sBoLdNUt1fcwM4
+d6DLBrBSuGis+AAKSzCUzSCFL0o9O8mID4u0QMyl0xQnzwVWu1xVpgU6K0o5Ck+
1bUfJBXvU8R78vhk+s25dkQeFmk7cuOdF8gKVH3jRy5qgQLPUp07+Tw9ZAul6Huc
9oLk5tfQ6Tzmfj6BYjBV4RCwGMegpfEukE4BYsix0KAYZ0Gj6pop9a0db+iINInp
gwIDAQAB
-----END PUBLIC KEY-----`

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


module.exports = {verifyWithPublicKey, decryptWithPrivateKey, generateRandomString, DEFAULT_PASSWORD, DEFAULT_PUBLIC_KEY}

//
// const data = JSON.parse('{"signature":"t1I7K8Kq3WhcaRfcEXO2RdWQWBzlNBjCjxLPeYHzn7PKfbpWY6hznLhGfQocd0o4tGN4fChQ8vdVjaxtI87fbdBZ+4OZri6PoNtC7xkwq1Lp11SpWBEyKW+dsDHzfaKcUaI/9lQsN/cAT5E+K/uYOQLrWcAU7bab3ZyXxkaui06ZTMZn3/4RHsq50MkxSQLnJM7ajB3VrZuYrkQCwj+gUAITuAH2CP8rubkSdJozgoIwxzUqd62nC2p9dUMigN0yogpSQaNXiizlBf78ezGDycQZUtAhCXgFF64aTav2CNdia2LOx+sB25td6zlqIMs694/HjANivTSX5XiwenL8/Q==","data":"{\\"time\\":1722367231799,\\"rnd\\":\\"4ecadc61932330cf\\"}"}');
// const b = verifyWithPublicKey(DEFAULT_PUBLIC_KEY, data.data, data.signature);
// console.log(b);