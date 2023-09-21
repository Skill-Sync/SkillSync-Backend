const { createClient } = require('redis');

// const redisConfig =
//     process.env.NODE_ENV === 'production'
//         ? {
//               url: `${process.env.REDIS_URL}`
//           }
//         : {};

const redisClient = createClient({
    url:
        'redis://default:145b15782fff4086b23126a3d07305ce@amusing-bulldog-39687.upstash.io:39687'
});

// const redisClient = createClient();

redisClient.on('error', err =>
    console.log(
        'Redis Client Error',
        err,
        'redisConfig',
        redisConfig,
        'url',
        process.env.REDIS_URL,
        'process.env',
        process.env.NODE_ENV === 'production'
    )
);

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
