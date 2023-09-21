const {
    connect,
    setOne,
    setMany,
    getOne,
    getMany,
    removeFromSet
} = require('./../utils/redis');
const User = require('./../models/user.model');

const dyte = require('./../utils/dyte');

connect();

function getcrossSkill(str) {
    return `${str.split('/')[1]}/${str.split('/')[0]}`;
}

async function searchForMatch(crossSkill, notToProvide) {
    return new Promise(resolve => {
        let results = {};
        //set interval for firing the search every 1/2 secend
        const intervalId = setInterval(async () => {
            // console.log('searching for match');
            const crossSkillUsers = await getMany(crossSkill);
            //remove any user that is in notToProvide
            // console.log(
            //     crossSkillUsers,
            //     'crossSkill',
            //     notToProvide,
            //     'notToProvide'
            // );
            crossSkillUsers.filter(user => {
                if (!notToProvide.includes(user)) {
                    // console.log('user not in notToProvide', user);
                    return user;
                }
            });

            // console.log(crossSkillUsers, notToProvide);
            if (crossSkillUsers.length > 0) {
                results = { found: true, MatchedUserId: crossSkillUsers[0] };
                // console.log('match found', results);
            } else {
                results = { found: false, MatchedUserId: null };
                // console.log('no match found', results);
            }
        }, 1 * 1000);

        //set time out for searching for match 5 secends (if no match found)
        setTimeout(() => {
            console.log('returning results', results);
            clearInterval(intervalId);
            resolve(results);
        }, 5 * 1000);
    });
}

function createSkills(wantedSkill, userSkills) {
    const userSkillsArray = [...new Set(userSkills)];
    let strings = [];
    // console.log(userSkillsArray, wantedSkill);
    userSkillsArray.map(skill => {
        strings.push(`${skill}/${wantedSkill}`);
    });
    return strings;
}

exports.findMatch = async (userId, wantedInnerSkill, userSocketId) => {
    const userInner = await User.findById(userId);
    //test
    // console.log(userInner);
    const userInnerSkills = userInner.skillsLearned.map(skillLearned => {
        // console.log(skillLearned);
        return skillLearned.skill?.name;
    });
    //test
    // console.log(userInnerSkills);
    await setOne(`${userInner._id}/state`, 'started');
    await setMany([`${userInner._id}`], `${userSocketId}`);
    // await setMany([`${userInner._id}/not-to-provide`], 'Starter');
    // 4- create search tags
    const tags = createSkills(wantedInnerSkill, userInnerSkills);
    // console.log(tags);
    // console.log(await getMany(tags[0]));
    await setMany(tags, `${userInner._id}`);
    // 5- search for match
    // console.log(tags, '-------------------tags');
    const tag = tags[0];
    const crossSkill = getcrossSkill(tag);
    const notToProvide = await getMany(`${userInner._id}/not-to-provide`);
    // console.log(crossSkill);
    // console.log(notToProvide);
    // console.log(`${tag}`, await getMany(tag), 'tag conten');
    while (true) {
        const match = await searchForMatch(crossSkill, notToProvide);

        const state = await getOne(`${userInner._id}/${match.MatchedUserId}`);

        const singleUserState = await getOne(`${userInner._id}/state`);

        // console.log(singleUserState, 'singleUserState');
        // console.log(state, 'state');

        if (singleUserState === 'stopped' || singleUserState === 'found') {
            console.log('hi from stopped or found');
            return { emitMatchFound: false };
        } else if (match.found || state === 'started') {
            console.log('hi from match-found event');
            // console.log(
            //     `${userInner._id}/${match.MatchedUserId}`,
            //     'buggg'
            // );
            const matchSocketId = await getMany(`${match.MatchedUserId}`);
            const userSockets = await getMany(`${userInner._id}`);
            const matchedUser = await User.findById(match.MatchedUserId);

            await removeFromSet(tag, `${userInner._id}`);
            await removeFromSet(crossSkill, `${match.MatchedUserId}`);
            await setOne(`${userInner._id}/${match.MatchedUserId}`, 'started');
            await setOne(`${userInner._id}/state`, 'found');
            await setOne(`${matchedUser._id}/state`, 'found');
            return {
                emitMatchFound: true,
                matchedUser,
                userInner,
                userSockets,
                matchSockets: matchSocketId
            };
        }
    }
};

exports.clinetApproval = async (userId, MatchedUserId) => {
    const user = await User.findById(userId);
    const matchedUser = await User.findById(MatchedUserId);

    console.log('hi from global approval');

    const status1 = await getOne(`${userId}/${MatchedUserId}`);
    const status2 = await getOne(`${MatchedUserId}/${userId}`);
    const status = status1 || status2;

    console.log(status, status1, status2, 'status');
    if (status === 'started') {
        console.log('hi from started');
        await setOne(`${userId}/${MatchedUserId}`, 'pending');
    } else if (status === 'pending') {
        console.log('hi from pending');
        await setOne(`${userId}/${MatchedUserId}`, 'approved');

        // console.log(this.id);

        const matchSocketIds = await getMany(`${MatchedUserId}`);
        const userSocketIds = await getMany(`${userId}`);

        //1- create meeting
        const meetingID = await dyte.createDyteMeeting(
            `${userId}/${MatchedUserId}`
        );
        //2- add the two participant to meeting
        const userToken = await dyte.addUserToMeeting(meetingID, {
            name: user.name,
            preset_name: 'test',
            custom_participant_id: user._id
        });

        const matchedUserToken = await dyte.addUserToMeeting(meetingID, {
            name: matchedUser.name,
            preset_name: 'test',
            custom_participant_id: matchedUser._id
        });

        return {
            emitServerApproval: true,
            user,
            matchedUser,
            userToken,
            matchedUserToken,
            userSocketIds,
            matchSocketIds
        };
    }
    return { emitServerApproval: false };
};

exports.clientRejection = async (userId, MatchedUserId) => {
    console.log('hi from global rejection');
    // const socketId = this.id;

    const user = await User.findById(userId);
    const matchedUser = await User.findById(MatchedUserId);

    const status1 = await getOne(`${userId}/${MatchedUserId}`);
    const status2 = await getOne(`${MatchedUserId}/${userId}`);
    const status = status1 || status2;

    // console.log(socketId);
    console.log(status, status1, status2);

    if (status === 'started' || status === 'pending') {
        await setOne(`${userId}/${MatchedUserId}`, 'rejected');

        await setMany([`${userId}/not-to-provide`], `${MatchedUserId}`);

        await setMany([`${MatchedUserId}/not-to-provide`], `${userId}`);

        const matchSocketIds = await getMany(`${MatchedUserId}`);
        const userSocketIds = await getMany(`${userId}`);

        console.log(matchSocketIds, userSocketIds, socketId);

        return {
            emitServerRejection: true,
            userSocketIds,
            matchSocketIds,
            user,
            matchedUser
        };
    }
    return { emitServerRejection: false };
};

exports.clientCancelation = async (userId, wantedInnerSkill) => {
    console.log('hi from cancel-search');

    // const state = await getOne(`${userId}/state`);
    // console.log(state);
    const userInner = await User.findById(userId);
    const userInnerSkills = userInner.skillsLearned.map(skillLearned => {
        return skillLearned.skill?.name;
    });
    const tags = createSkills(wantedInnerSkill, userInnerSkills);

    // console.log(tags);

    await setOne(`${userId}/state`, 'stopped');
    tags.forEach(async tag => {
        // console.log(`${tag}`, await getMany(tag), 'this tag content');
        await removeFromSet(tag, `${userInner._id}`);
        // console.log(`${tag}`, await getMany(tag), 'this tag content');
    });
};
