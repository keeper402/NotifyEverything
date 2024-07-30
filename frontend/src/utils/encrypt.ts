import * as forge from 'node-forge';
import { createHash } from 'crypto';
// const forge = require('node-forge');
// const {createHash} = require('crypto');

/**
 * 使用主密钥生成 RSA 公钥和私钥
 * @param masterKey 主密钥
 * @returns { publicKey: string, privateKey: string }
 */
export function generateRSAKeyPairFromMasterKey(masterKey: string): { publicKey: string, privateKey: string } {
    // 使用主密钥生成一个种子
    const seed = createHash('sha256').update(masterKey).digest('hex');

    // 创建一个随机数生成器并使用种子初始化
    const prng = forge.random.createInstance();
    prng.seedFileSync = () => seed;

    // 生成 RSA 密钥对
    const keyPair = forge.pki.rsa.generateKeyPair({
        bits: 2048,
        e: 0x10001,
        prng: prng
    });

    // 将密钥对转换为 PEM 格式
    const publicKeyPem = forge.pki.publicKeyToPem(keyPair.publicKey);
    const privateKeyPem = forge.pki.privateKeyToPem(keyPair.privateKey);

    return {
        publicKey: publicKeyPem,
        privateKey: privateKeyPem
    };
}


// 私钥解密
export function encryptWithPublicKey(publicKeyPem: string, data: string): string {
    const publicKey = forge.pki.publicKeyFromPem(publicKeyPem);
    const encrypted = publicKey.encrypt(forge.util.encodeUtf8(data));
    return forge.util.encode64(encrypted);
}

// 公钥加密
export function decryptWithPrivateKey(privateKeyPem: string, encryptedData: string): string {
    const privateKey = forge.pki.privateKeyFromPem(privateKeyPem);
    const decrypted = privateKey.decrypt(forge.util.decode64(encryptedData));
    return forge.util.decodeUtf8(decrypted);
}

// 私钥签名
export function signWithPrivateKey(privateKeyPem: string, data: string): string {
    const privateKey = forge.pki.privateKeyFromPem(privateKeyPem);
    const md = forge.md.sha256.create();
    md.update(data, 'utf8');
    const signature = privateKey.sign(md);
    return forge.util.encode64(signature);
}

// 公钥验签
export function verifyWithPublicKey(publicKeyPem: string, data: string, signature: string): boolean {
    const publicKey = forge.pki.publicKeyFromPem(publicKeyPem);
    const md = forge.md.sha256.create();
    md.update(data, 'utf8');
    return publicKey.verify(md.digest().bytes(), forge.util.decode64(signature));
}


export function generateRandomString(length: number): string {
    if(length % 2 !== 0) {
        throw new Error("The length must be an even number.");
    }
    const bytes = forge.random.getBytesSync(length / 2);
    // 将字节转换为十六进制字符串
    return forge.util.bytesToHex(bytes);
}


// 使用示例
const masterKey = '123123';
const t1 = Date.now();
const { publicKey, privateKey } = generateRSAKeyPairFromMasterKey(masterKey);
const t2 = Date.now();
console.log(`time generateRSAKeyPairFromMasterKey ${t2 - t1}ms`);

console.log('Public Key:', publicKey);
console.log('Private Key:', privateKey);

const t3 = Date.now();
const signText = signWithPrivateKey(privateKey, 'test');
const t4 = Date.now();
console.log(`time signWithPrivateKey ${t4 - t3}ms`);
console.log('encrypt test:', signText);
const t5 = Date.now();
console.log('decrypt test:', verifyWithPublicKey(publicKey, 'test', signText));
const t6 = Date.now();
console.log(`time verifyWithPublicKey ${t6 - t5}ms`);

const t7 = Date.now();
const encrypt = encryptWithPublicKey(publicKey, 'test123');
const t8 = Date.now();
console.log(`time encryptWithPublicKey ${t8 - t7}ms`);
console.log('encrypt:', encrypt);
const t9 = Date.now();
const decrypt = decryptWithPrivateKey(privateKey, encrypt);
const t10 = Date.now();
console.log(`time decryptWithPrivateKey ${t10 - t9}ms`);
console.log('decrypt:', decrypt);