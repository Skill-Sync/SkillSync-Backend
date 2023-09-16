const http = require('http');
const path = require('path');
const dotenv = require('dotenv');
const { Server } = require('socket.io');

const app = require('./app');
const sockets = require('./utils/sockets');
const { mongoConnect } = require('./utils/mongoDB');
//------------------Config------------------//
dotenv.config({ path: path.join(__dirname, '..', 'config.env') });
//------------------Listener-----------------//
const port = process.env.PORT || 3000;
const server = http.createServer(app);
const socketServer = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

(async function startServer() {
    await mongoConnect();
    // Start the server
    server.listen(port, () =>
        console.log(
            `Server listening on port ${port} in the ${process.env.NODE_ENV} mode`
        )
    );
    // Start Socket Listener
    sockets.listen(socketServer);
})();

//----------Exception Handling-------------//
process.on('uncaughtException', err => {
    console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
    console.log(err.name, err.message);
    process.exit(1);
});
// //--------------Rejection Handling------------//
process.on('unhandledRejection', err => {
    console.log('UNHANDLED REJECTION! 💥 Shutting down...');
    console.log(err.name, err.message);
    server.close(() => {
        process.exit(1);
    });
});
process.on('SIGTERM', () => {
    console.log('👋 SIGTERM RECEIVED. Shutting down gracefully');
    // server.close(() => {
    //     console.log('💥 Process terminated!');
    // });
});
