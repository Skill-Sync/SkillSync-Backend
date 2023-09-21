const User = require('../models/user.model');
// const { createClient } = require('redis');
// const dyte = require('./dyte');
const {
    findMatch,
    clinetApproval,
    clientRejection,
    clientCancelation
} = require('./../services/matching.services');

// const redisConfig =
//     process.env.NODE_ENV === 'production'
//         ? {
//               url: process.env.REDIS_URL
//           }
//         : {};

// const redisClient = createClient(redisConfig);

// redisClient.on('error', err => console.log('Redis Client Error', err));

// (async function connect() {
//     await redisClient.connect();
// })();

// async function setOne(key, value) {
//     await redisClient.set(key, value);
// }

// async function setMany(keys, value) {
//     console.log('hi from set many');
//     console.log(keys, value);
//     // await Promise.all(
//     keys.forEach(async key => {
//         // The key you want to check for

//         // Use the EXISTS command to check if the key exists
//         console.log(key);
//         redisClient.sAdd(key, value, (err, addedCount) => {
//             if (err) {
//                 console.error('Error adding values to set:', err);
//                 return;
//             }
//             console.log('Added', key, value, 'to set', addedCount, 'times');
//         });
//         //     if ((await redisClient.get(keyToCheck)) === null) {
//         //         console.log('key does not exist', key, value);
//         //         await redisClient.sAdd(key, value, (err, reply) => {
//         //             if (err) {
//         //                 console.error('Error setting key:', err);
//         //                 return;
//         //             }
//         //             console.log('Key set successfully:', reply);
//         //         });
//         //     } else {
//         //         //test
//         //         console.log('key exists', key, value);
//         //         redisClient.sAdd(key, 'fifdas', (err, addedCount) => {
//         //             if (err) {
//         //                 console.error('Error adding values to set:', err);
//         //                 return;
//         //             }
//         //             console.log('Added', key, value, 'to set', addedCount, 'times');
//         //         });
//         //     }
//     });
// }

// function getcrossSkill(str) {
//     return `${str.split('/')[1]}/${str.split('/')[0]}`;
// }

// async function searchForMatch(crossSkill, notToProvide) {
//     return new Promise(resolve => {
//         let results = {};
//         //set interval for firing the search every 1/2 secend
//         const intervalId = setInterval(async () => {
//             console.log('searching for match');
//             const crossSkillUsers = await getMany(crossSkill);
//             //remove any user that is in notToProvide
//             console.log(
//                 crossSkillUsers,
//                 'crossSkill',
//                 notToProvide,
//                 'notToProvide'
//             );
//             crossSkillUsers.filter(user => {
//                 if (!notToProvide.includes(user)) {
//                     console.log('user not in notToProvide', user);
//                     return user;
//                 }
//             });

//             console.log(crossSkillUsers, notToProvide);
//             if (crossSkillUsers.length > 0) {
//                 results = { found: true, MatchedUserId: crossSkillUsers[0] };
//                 console.log('match found', results);
//             } else {
//                 results = { found: false, MatchedUserId: null };
//                 console.log('no match found', results);
//             }
//         }, 1 * 1000);

//         //set time out for searching for match 5 secends (if no match found)
//         setTimeout(() => {
//             console.log('returning results', results);
//             clearInterval(intervalId);
//             resolve(results);
//         }, 5 * 1000);
//     });
// }

// function createSkills(wantedSkill, userSkills) {
//     const userSkillsArray = [...new Set(userSkills)];
//     let strings = [];
//     console.log(userSkillsArray, wantedSkill);
//     userSkillsArray.map(skill => {
//         strings.push(`${skill}/${wantedSkill}`);
//     });
//     return strings;
// }

// async function getOne(key) {
//     return await redisClient.get(key);
// }

// async function removeFromSet(key, value) {
//     await redisClient.sRem(key, value, (err, reply) => {
//         if (err) {
//             console.error('Error removing value from set:', err);
//             return;
//         }
//         console.log('Removed', value, 'from set', key, reply, 'times');
//     });
// }

// async function getMany(key) {
//     return await redisClient.sMembers(key);
// }

const listen = function(io) {
    console.log(
        `Socket server start listening on server port ${process.env.PORT}`
    );

    io.on('connection', async socket => {
        socket.on('start-searching', async function({
            userId,
            wantedInnerSkill,
            userSocketId
        }) {
            try {
                const socketId = this.id;

                const {
                    emitMatchFound,
                    userSockets,
                    matchSockets,
                    userInner,
                    matchedUser
                } = await findMatch(userId, wantedInnerSkill, userSocketId);

                if (emitMatchFound) {
                    io.to(socketId)
                        .to(userSockets)
                        .to(matchSockets)
                        .emit('match-found', {
                            user1: matchedUser,
                            user2: userInner
                        });
                }
            } catch (err) {
                console.log(err.message);
            }
        });

        socket.on('client-approval', async function({ userId, MatchedUserId }) {
            try {
                const socketId = this.id;

                const {
                    emitServerApproval,
                    userSocketIds,
                    matchSocketIds,
                    user,
                    matchedUser,
                    userToken,
                    matchedUserToken
                } = await clinetApproval(userId, MatchedUserId);

                if (emitServerApproval) {
                    io.to(socketId)
                        .to(userSocketIds)
                        .emit('server-approval', {
                            user1: user,
                            user2: matchedUser,
                            authToken: userToken
                        });

                    io.to(socketId)
                        .to(matchSocketIds)
                        .emit('server-approval', {
                            user1: matchedUser,
                            user2: user,
                            authToken: matchedUserToken
                        });
                }
            } catch (err) {
                console.log(err.message);
            }
        });

        socket.on('client-rejection', async function({
            userId,
            MatchedUserId
        }) {
            try {
                const socketId = this.id;

                const {
                    emitServerRejection,
                    userSocketIds,
                    matchSocketIds,
                    user,
                    matchedUser
                } = await clientRejection(userId, MatchedUserId);

                if (emitServerRejection) {
                    io.to(socketId)
                        .to(userSocketIds)
                        .to(matchSocketIds)
                        .emit('server-rejection', {
                            user1: user,
                            user2: matchedUser
                        });
                }
            } catch (err) {
                console.log(err.message);
            }
        });

        socket.on('cancel-search', async function({
            userId,
            wantedInnerSkill
        }) {
            try {
                await clientCancelation(userId, wantedInnerSkill);
            } catch (err) {
                console.log(err.message);
            }
        });

        socket.on('disconnect', reason => {
            console.log('disconnected', reason);
        });
    });
};

module.exports = {
    listen
};

//TODO: 1- refactor for modularity
