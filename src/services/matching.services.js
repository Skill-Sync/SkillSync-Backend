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
    //test----------------
    // console.log(userInner);
    //--------------------
    const userInnerSkills = userInner.skillsLearned.map(skillLearned => {
        //test----------------
        // console.log(skillLearned);
        //--------------------
        return skillLearned.skill?.name;
    });
    //test----------------
    // console.log(userInnerSkills);
    //--------------------
    //setting the user session state to started
    await setOne(`${userInner._id}/state`, 'started');
    //preseting the user socket id in redis
    await setMany([`${userInner._id}`], `${userSocketId}`);
    // 4- create search tags
    const tags = createSkills(wantedInnerSkill, userInnerSkills);
    //test----------------
    // console.log(tags);
    // console.log(await getMany(tags[0]));
    //--------------------
    //setting the user tags in redis with initial  user id value of first user to have this skill tag
    await setMany(tags, `${userInner._id}`);
    //test----------------
    // console.log(tags, 'tags');
    //--------------------
    //start searching for match for only the first user skill tag
    const tag = tags[0];
    //get the opposite skill tag to match with the first user skill tag
    const crossSkill = getcrossSkill(tag);
    //get the not to provide list (a list of all rejected users) of user
    const notToProvide = await getMany(`${userInner._id}/not-to-provide`);
    //test----------------
    // console.log(crossSkill);
    // console.log(notToProvide);
    // console.log(`${tag}`, await getMany(tag), 'tag conten');
    //--------------------
    //start searching for match as long as the user session state is not stopped or found
    while (true) {
        const match = await searchForMatch(crossSkill, notToProvide);

        //get the state of the user/matchedUser session
        const state = await getOne(`${userInner._id}/${match.MatchedUserId}`);

        //get the state of the user session
        const singleUserState = await getOne(`${userInner._id}/state`);

        //test----------------
        // console.log(singleUserState, 'singleUserState');
        // console.log(state, 'state');
        //--------------------

        //if the user session state is stopped or found
        if (singleUserState === 'stopped' || singleUserState === 'found') {
            console.log('hi from stopped or found');
            return { emitMatchFound: false };
            //if the user/matchedUser session state is stated
        } else if (match.found || state === 'started') {
            //test----------------
            // console.log('hi from match-found event');
            // console.log(
            //     `${userInner._id}/${match.MatchedUserId}`,
            //     'buggg'
            // );
            //--------------------
            //get the socket id of the matched user
            const matchSocketId = await getMany(`${match.MatchedUserId}`);
            //get the socket ids of the user
            const userSockets = await getMany(`${userInner._id}`);
            //get the matched user
            const matchedUser = await User.findById(match.MatchedUserId);

            //remove the user from tag (skill) matching queue
            await removeFromSet(tag, `${userInner._id}`);

            //remove the matched user from tag (skill) matching queue
            await removeFromSet(crossSkill, `${match.MatchedUserId}`);

            //set the user/matchedUser session state to started
            await setOne(`${userInner._id}/${match.MatchedUserId}`, 'started');

            //set the user session state to found
            await setOne(`${userInner._id}/state`, 'found');

            //set the matchedUser session state to found
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
    //get the user
    const user = await User.findById(userId);

    //get the matched user
    const matchedUser = await User.findById(MatchedUserId);

    //test----------------
    // console.log('hi from global approval');
    //--------------------

    //get the state of the user/matchedUser session
    const status1 = await getOne(`${userId}/${MatchedUserId}`);
    const status2 = await getOne(`${MatchedUserId}/${userId}`);
    const status = status1 || status2;

    //test----------------
    // console.log(status, status1, status2, 'status');
    //--------------------

    //if the user/matchedUser session state is started set matching session state to pending
    if (status === 'started') {
        //test----------------
        // console.log('hi from started');
        //--------------------
        await setOne(`${userId}/${MatchedUserId}`, 'pending');

        //if the user/matchedUser session state is pending set matching session state to approved and create meeting then add the two participant to meeting
    } else if (status === 'pending') {
        //test----------------
        // console.log('hi from pending');
        // console.log(this.id);
        //--------------------

        await setOne(`${userId}/${MatchedUserId}`, 'approved');

        //get the socket ids of the matched user
        const matchSocketIds = await getMany(`${MatchedUserId}`);
        //get the socket ids of the user
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
    //test----------------
    // console.log('hi from global rejection');
    // const socketId = this.id;
    //--------------------

    //get the user
    const user = await User.findById(userId);
    //get the matched user
    const matchedUser = await User.findById(MatchedUserId);

    //get the state of the user/matchedUser session
    const status1 = await getOne(`${userId}/${MatchedUserId}`);
    const status2 = await getOne(`${MatchedUserId}/${userId}`);
    const status = status1 || status2;

    //test----------------
    // console.log(socketId);
    // console.log(status, status1, status2);
    //--------------------

    //if the user/matchedUser session state is started or pending set matching session state to rejected and add the rejected user to the blocked list of the other user
    if (status === 'started' || status === 'pending') {
        await setOne(`${userId}/${MatchedUserId}`, 'rejected');

        await setMany([`${userId}/not-to-provide`], `${MatchedUserId}`);

        await setMany([`${MatchedUserId}/not-to-provide`], `${userId}`);

        //get the socket ids of the matched user
        const matchSocketIds = await getMany(`${MatchedUserId}`);
        //get the socket ids of the user
        const userSocketIds = await getMany(`${userId}`);

        //test----------------
        // console.log(matchSocketIds, userSocketIds);
        //--------------------

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
    // console.log('hi from cancel-search');

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
