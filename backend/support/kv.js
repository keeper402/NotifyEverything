const {kv} = require("@vercel/kv");

class KvStore {

    static async set(key, value, expire) {
        if (expire) {
            await kv.set(key, value, {
                expiry: Date.now() + expire * 1000
            });
        } else {
            await kv.set(key, value);
        }
    }

    static async get(key) {
        return await kv.get(key);
    }

}

module.exports = KvStore;