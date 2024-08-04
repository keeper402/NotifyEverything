const {kv} = require("@vercel/kv");

class KvStore {

    static async set(key, value, expire) {
        console.log(`setKey ${key} value: ${value} expire: ${expire}`);
        if (expire) {
            await kv.set(key, value, {
                expiry: Date.now() + expire * 1000
            });
        } else {
            console.log(`setKey ${key} value: ${value} expired`);
            await kv.set(key, value);
        }
    }

    static async get(key) {
        return await kv.get(key);
    }

}

module.exports = KvStore;