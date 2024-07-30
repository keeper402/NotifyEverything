import {kv} from "@vercel/kv";

class KvStore {

    static async set(key, value) {
        await kv.set(key, value);
    }

    static async get(key) {
        return await kv.get(key);
    }

}

module.exports = KvStore;