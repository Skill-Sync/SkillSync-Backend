const listen = function(io) {
  // console.log();
  const chatNS = io.of('/chat');
  const matchNS = io.of('/match');
  chatNS.on('connection', socket => {
    //

    socket.on('disconnect', reason => {
      console.log(`Client ${socket.id} disconnected: ${reason}`);
    });
  });

  matchNS.on('connection', socket => {
    //

    socket.on('disconnect', reason => {
      console.log(`Client ${socket.id} disconnected: ${reason}`);
    });
  });
};

export default { listen };
