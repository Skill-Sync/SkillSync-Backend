const { createClient } = require('redis');

const redisConfig =
    process.env.NODE_ENV === 'production'
        ? {
              url: process.env.REDIS_URL
          }
        : {};

const redisClient = createClient(redisConfig);

redisClient.on('error', err => console.log('Redis Client Error', err));

async function connect() {
    await redisClient.connect();
}

async function disconnect() {
    await redisClient.disconnect();
}

async function setOne(key, value) {
    await redisClient.set(key, value);
}

async function setMany(keys, value) {
    keys.forEach(async key => {
        redisClient.sAdd(key, value, (err, addedCount) => {
            if (err) {
                console.error('Error adding values to set:', err);
                return;
            }
            console.log('Added', key, value, 'to set', addedCount, 'times');
        });
    });
}

async function getOne(key) {
    return await redisClient.get(key);
}

async function removeFromSet(key, value) {
    await redisClient.sRem(key, value, (err, reply) => {
        if (err) {
            console.error('Error removing value from set:', err);
            return;
        }
        console.log('Removed', value, 'from set', key, reply, 'times');
    });
}

async function getMany(key) {
    return await redisClient.sMembers(key);
}

module.exports = {
    connect,
    setOne,
    setMany,
    getOne,
    getMany,
    removeFromSet,
    disconnect
};
