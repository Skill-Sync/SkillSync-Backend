const User = require('../models/user.model');
const { createClient } = require('redis');

const redisClient = createClient();

redisClient.on('error', err => console.log('Redis Client Error', err));

(async function connect() {
    await redisClient.connect();
})();

async function setOne(key, value) {
    await redisClient.set(key, value);
}

async function setMany(keys, value) {
    console.log('hi from set many');
    console.log(keys, value);
    // await Promise.all(
    keys.forEach(async key => {
        // The key you want to check for

        // Use the EXISTS command to check if the key exists
        console.log(key);
        redisClient.sAdd(key, value, (err, addedCount) => {
            if (err) {
                console.error('Error adding values to set:', err);
                return;
            }
            console.log('Added', key, value, 'to set', addedCount, 'times');
        });
        //     if ((await redisClient.get(keyToCheck)) === null) {
        //         console.log('key does not exist', key, value);
        //         await redisClient.sAdd(key, value, (err, reply) => {
        //             if (err) {
        //                 console.error('Error setting key:', err);
        //                 return;
        //             }
        //             console.log('Key set successfully:', reply);
        //         });
        //     } else {
        //         //test
        //         console.log('key exists', key, value);
        //         redisClient.sAdd(key, 'fifdas', (err, addedCount) => {
        //             if (err) {
        //                 console.error('Error adding values to set:', err);
        //                 return;
        //             }
        //             console.log('Added', key, value, 'to set', addedCount, 'times');
        //         });
        //     }
    });
}

function getcrossSkill(str) {
    return `${str.split('/')[1]}/${str.split('/')[0]}`;
}

async function searchForMatch(crossSkill, notToProvide) {
    return new Promise(resolve => {
        let results = {};
        //set interval for firing the search every 1/2 secend
        const intervalId = setInterval(async () => {
            console.log('searching for match');
            const crossSkillUsers = await getMany(crossSkill);
            //remove any user that is in notToProvide
            console.log(
                crossSkillUsers,
                'crossSkill',
                notToProvide,
                'notToProvide'
            );
            crossSkillUsers.filter(user => {
                if (!notToProvide.includes(user)) {
                    console.log('user not in notToProvide', user);
                    return user;
                }
            });

            console.log(crossSkillUsers, notToProvide);
            if (crossSkillUsers.length > 0) {
                results = { found: true, MatchedUserId: crossSkillUsers[0] };
                console.log('match found', results);
            } else {
                results = { found: false, MatchedUserId: null };
                console.log('no match found', results);
            }
        }, 500);

        //set time out for searching for match 5 secends (if no match found)
        setTimeout(() => {
            console.log('returning results', results);
            clearInterval(intervalId);
            resolve(results);
        }, 5000);
    });
}

function createSkills(wantedSkill, userSkills) {
    const userSkillsArray = [...new Set(userSkills)];
    let strings = [];
    console.log(userSkillsArray, wantedSkill);
    userSkillsArray.map(skill => {
        strings.push(`${skill}/${wantedSkill}`);
    });
    return strings;
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

const listen = function(io) {
    console.log(
        `Socket server start listening on server port ${process.env.PORT}`
    );

    io.on('connection', async socket => {
        let user, wantedSkill, userSkills;
        const socketId = socket.id;
        console.log(socketId, 'socketId');
        //1- get user to user skills
        // console.log('connected');
        socket.on('start-search', async function({
            userId,
            wantedInnerSkill,
            userSocketId
        }) {
            try {
                const socketId = this.id;
                console.log(
                    userId,
                    'userId',
                    wantedInnerSkill,
                    'wantedInnerSkill',
                    socketId,
                    'socket'
                );
                // console.log('connected');
                const userInner = await User.findById(userId);
                //test
                // console.log(userInner);
                const userInnerSkills = userInner.skillsLearned.map(
                    skillLearned => {
                        // console.log(skillLearned);
                        return skillLearned.skill?.name;
                    }
                );
                //test
                console.log(userInnerSkills);

                user = userInner;
                userSkills = userInnerSkills;
                wantedSkill = wantedInnerSkill;

                // await setOne(`${socketId}`, `${user._id}`);

                await setMany([`${user._id}`], `${userSocketId || socketId}`);

                await setMany([`${user._id}/not-to-provide`], 'Starter');

                // 4- create search tags
                tags = createSkills(wantedInnerSkill, userInnerSkills);

                // console.log(tags);
                // console.log(await getMany(tags[0]));

                await setMany(tags, `${user._id}`);

                // 5- search for match
                tags.map(async tag => {
                    const crossSkill = getcrossSkill(tag);
                    const notToProvide = await getMany(
                        `${user._id}/not-to-provide`
                    );
                    const match = await searchForMatch(
                        crossSkill,
                        notToProvide
                    );

                    if (match.found) {
                        const matchSocketId = await getMany(
                            `${match.MatchedUserId}`
                        );
                        const userSockets = await getMany(`${user._id}`);
                        io.to(socketId)
                            .to(userSockets)
                            .to(matchSocketId)
                            .emit('match-found', {
                                user1: match.MatchedUserId,
                                user2: user._id
                            });
                        await removeFromSet(tag, `${user._id}`);
                        await removeFromSet(
                            crossSkill,
                            `${match.MatchedUserId}`
                        );

                        await setOne(
                            `${user._id}/${match.MatchedUserId}`,
                            'started'
                        );
                    } else {
                        while (match.found === false) {
                            const match = await searchForMatch(
                                crossSkill,
                                notToProvide
                            );

                            if (match.found) {
                                break;
                            }
                        }

                        // if (match.found) {
                        const matchSocketId = await getMany(
                            `${match.MatchedUserId}`
                        );
                        const userSockets = await getMany(`${user._id}`);

                        io.to(socketId)
                            .to(userSockets)
                            .to(matchSocketId)
                            .emit('match-found', {
                                user1: match.MatchedUserId,
                                user2: user._id
                            });

                        await removeFromSet(tag, `${user._id}`);
                        await removeFromSet(
                            crossSkill,
                            `${match.MatchedUserId}`
                        );

                        await setOne(
                            `${user._id}/${match.MatchedUserId}`,
                            'started'
                        );
                        // }
                    }
                });

                // io.to(socketId).emit('dude', { info: { isFuckable: false } });
            } catch (err) {
                console.log(err.message);
            }
        });

        socket.on('client-approval', async function({ userId, MatchedUserId }) {
            try {
                const socketId = this.id;
                console.log('hi from global approval');
                const status = await getOne(`${userId}/${MatchedUserId}`);

                console.log(status);
                if (status === 'started') {
                    console.log('hi from started');
                    await setOne(`${userId}/${MatchedUserId}`, 'pending');
                } else if (status === 'pending') {
                    console.log('hi from pending');
                    await setOne(`${userId}/${MatchedUserId}`, 'approved');

                    console.log(this.id);

                    const matchSocketIds = await getMany(`${MatchedUserId}`);
                    const userSocketIds = await getMany(`${userId}`);

                    //add auth-token and create meeting and add particbant
                    io.to(socketId)
                        .to(userSocketIds)
                        .to(matchSocketIds)
                        .emit('server-approval', {
                            user1: userId,
                            user2: MatchedUserId
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
                const status = await getOne(`${userId}/${MatchedUserId}`);

                console.log(socketId);
                console.log(status);

                if (status === 'started' || status === 'pending') {
                    await setOne(`${userId}/${MatchedUserId}`, 'rejected');

                    await setMany(
                        [`${userId}/not-to-provide`],
                        `${MatchedUserId}`
                    );

                    await setMany(
                        [`${MatchedUserId}/not-to-provide`],
                        `${userId}`
                    );

                    const matchSocketIds = await getMany(`${MatchedUserId}`);
                    const userSocketIds = await getMany(`${userId}`);

                    console.log(matchSocketIds, userSocketIds, socketId);

                    io.to(socketId)
                        .to(userSocketIds)
                        .to(matchSocketIds)
                        .emit('server-rejection', {
                            user1: userId,
                            user2: MatchedUserId
                        });
                }
            } catch (err) {
                console.log(err.message);
            }
        });

        // socket.on('disconnect', reason => {});
    });
};

module.exports = {
    listen
};

//TODO:1- resolve the issue of the user not being able to connect to the socket server because his socket id is not saved in the redis database
//TODO: match-found : user1,user2 full data
//all users are with full data
