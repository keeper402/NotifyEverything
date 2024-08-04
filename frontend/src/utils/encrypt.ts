import forge from 'node-forge';
// const forge = require('node-forge');

interface EncryptAES {
    iv: string;
    tag: string;
    encrypted: string;
}

/**
 * 使用主密钥生成 RSA 公钥和私钥
 * @param masterKey 主密钥
 * @returns { publicKey: string, privateKey: string }
 */
export function generateRSAKeyPairFromMasterKey(masterKey: string): { publicKey: string, privateKey: string } {
    // 使用主密钥生成一个种子
    const md = forge.md.sha256.create();
    md.update(masterKey);
    const seed = md.digest().toHex();

    // 创建一个随机数生成器并使用种子初始化
    const prng = forge.random.createInstance();
    prng.seedFileSync = () => seed;

    // 生成 RSA 密钥对
    const keyPair = forge.pki.rsa.generateKeyPair({
        bits: 1024,
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
function encryptWithPublicKey(publicKeyPem: string, data: string): string {
    const publicKey = forge.pki.publicKeyFromPem(publicKeyPem);
    const encrypted = publicKey.encrypt(forge.util.encodeUtf8(data));
    return forge.util.encode64(encrypted);
}

// 公钥加密
function decryptWithPrivateKey(privateKeyPem: string, encryptedData: string): string {
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
function verifyWithPublicKey(publicKeyPem: string, data: string, signature: string): boolean {
    const publicKey = forge.pki.publicKeyFromPem(publicKeyPem);
    const md = forge.md.sha256.create();
    md.update(data, 'utf8');
    return publicKey.verify(md.digest().bytes(), forge.util.decode64(signature));
}


export function generateRandomString(length: number): string {
    if (length % 2 !== 0) {
        throw new Error("The length must be an even number.");
    }
    const bytes = forge.random.getBytesSync(length / 2);
    // 将字节转换为十六进制字符串
    return forge.util.bytesToHex(bytes);
}

function encryptByAES(rawText: string, aesKey: string): EncryptAES {
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

export function decryptByAES(encrypted: EncryptAES, aesKey: string): string | null {
    const iv = forge.util.decode64(encrypted.iv);
    const tag = forge.util.decode64(encrypted.tag);
    const data = forge.util.decode64(encrypted.encrypted);

    const decipher = forge.cipher.createDecipher('AES-GCM', forge.util.createBuffer(aesKey, 'raw'));
    decipher.start({ iv: forge.util.createBuffer(iv), tag: forge.util.createBuffer(tag) });
    decipher.update(forge.util.createBuffer(data));

    const pass = decipher.finish();
    return pass ? forge.util.decodeUtf8(decipher.output.getBytes()) : null; // 检查解密是否成功
}


export function calculateMD5(data: string): string {
    // 创建 MD5 哈希对象
    const md = forge.md.md5.create();
    // 更新哈希对象
    md.update(data);
    // 返回十六进制格式的哈希值
    return md.digest().toHex();
}

function test() {
    // 使用示例
    const masterKey = '123123';
    const t1 = Date.now();
    const {publicKey, privateKey} = generateRSAKeyPairFromMasterKey(masterKey);
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

    const t11 = Date.now();
    const secretKey = 'e1bba94f2d11f26aaf9eadcfebb9771f';
    const encryptAES = encryptByAES('测试测试jldsfkajhdfkhalkjdf', secretKey);
    const t12 = Date.now();
    console.log(`time encryptAES ${t12 - t11}ms, encryptAES:${encryptAES.encrypted} and ${encryptAES.iv}`);

    const t13 = Date.now();
    const decryptByAES1 = decryptByAES(encryptAES, secretKey);
    const t14 = Date.now();
    console.log(`time decryptByAES ${t14 - t13}ms, text: ${decryptByAES1}`);
}

// test();