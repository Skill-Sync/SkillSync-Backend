const listen = function(io) {
  console.log(
    `Socket server start listening on server port ${process.env.PORT}`
  );
  const chatNS = io.of('/chat');
  const matchNS = io.of('/match');
  chatNS.on('connection', socket => {
    // chat logic here...
    socket.on('disconnect', reason => {});
  });

  matchNS.on('connection', socket => {
    // chat logic here...
    socket.on('disconnect', reason => {});
  });
};

module.exports = {
  listen
};
