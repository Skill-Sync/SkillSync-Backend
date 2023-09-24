const {
    findMatch,
    clinetApproval,
    clientRejection,
    clientCancelation
} = require('./../services/matching.services');

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

                console.log(socketId, 'socket');

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
