const {kv} = require("@vercel/kv");

class KvStore {

    static async set(key, value, expire) {
        if (expire) {
            console.log(`setKey ${key} expire: ${expire}`);
            await kv.set(key, value, {
                expiry: Date.now() + expire * 1000
            });
        } else {
            console.log(`setKey ${key}`);
            await kv.set(key, value);
        }
    }

    static async get(key) {
        return await kv.get(key);
    }

}

module.exports = KvStore;