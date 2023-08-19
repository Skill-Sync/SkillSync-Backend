const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// const { MongoMemoryServer } = require('mongodb-memory-server');
//------------------Config------------------//
dotenv.config({
  path: path.join(__dirname, '..', '..', 'config.env')
});

let [mongod, MongoInstance] = [null, false];

let MONGO_URL = process.env.DATABASE_Connection.replace(
  '<password>',
  process.env.DATABASE_Password
);
//------------------Connection------------------//
async function mongoConnect() {
  if (process.env.NODE_ENV == 'test') {
    mongod = await MongoMemoryServer.create();
    MONGO_URL = mongod.getUri();
    MongoInstance = true;
  } else {
    if (!process.env.DATABASE_Connection || !process.env.DATABASE_Password) {
      throw new Error(
        'Missing required environment variables: DATABASE_Connection and DATABASE_Password'
      );
    }
  }

  await mongoose.connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
}

async function mongoDisconnect() {
  await mongoose.disconnect();
  await mongoose.connection.close();
  if (mongod) {
    await mongod.stop();
  }
}
//------------------Listeners------------------//
mongoose.connection.once('open', () => {
  console.log(
    `DB connected successfully on ${
      MongoInstance ? 'MongoInstance' : 'Real Atlas MongoDB'
    }`
  );
});

mongoose.connection.on('error', err => {
  console.error(err);
});
//------------------Export------------------//
module.exports = {
  mongoConnect,
  mongoDisconnect
};
