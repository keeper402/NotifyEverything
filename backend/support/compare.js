const arrUtil = require('lodash');

function compareToKeys(objectOld, objectNew) {
    const oldKeys = objectOld !== undefined ? parseKeysNoError(objectOld) : [];
    const newKeys = Object.keys(objectNew);
    const sameKeys = arrUtil.intersection(oldKeys, newKeys);
    const toUpdate = [];
    for (let key of sameKeys) {
        if (JSON.stringify(objectOld[key]) !== JSON.stringify(objectNew[key])) {
            toUpdate.push(key);
        }
    }
    return {
        toDelete: arrUtil.difference(oldKeys, sameKeys),
        toUpdate: toUpdate,
        toCreate: arrUtil.difference(newKeys, sameKeys),
    };
}

function compareConfig(oldConfig, newConfig) {
    return {
        resourceReload: compareToKeys(oldConfig.resource, newConfig.resource),
        notifyReload: compareToKeys(oldConfig.notify, newConfig.notify),
        ruleReload: compareToKeys(oldConfig.rule, newConfig.rule)
    }

}

module.exports = compareConfig

function parseKeysNoError(object) {
    try {
        return Object.keys(object);
    } catch (e) {
        console.error('ignore error', e);
    }
    return [];
}