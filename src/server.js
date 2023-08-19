const dotenv = require('dotenv');
const http = require('http');
const path = require('path');

const app = require('./app');
const { mongoConnect } = require('./utils/mongoDB');
//------------------Config------------------//
dotenv.config({ path: path.join(__dirname, '..', 'config.env') });
//------------------Listener-----------------//
const port = process.env.PORT || 3000;
const server = http.createServer(app);

(async function startServer() {
  // Connect to MongoDB
  await mongoConnect();
  // Start the server
  server.listen(port, () =>
    console.log(`Listening on port ${port} in the ${process.env.NODE_ENV} mode`)
  );
})();
//--------------Exception Handling------------//
