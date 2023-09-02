const fs = require('fs');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

const User = require('../../src/models/usersModel');
const skill = require('../../src/models/skillsModel');
const Mentor = require('../../src/models/mentorsModel');
const Course = require('../../src/models/coursesModel');
const Review = require('../../src/models/reviewsModel');
//-------------------Config----------------//
dotenv.config({ path: './config.env' });
//--------------------DB-------------------//
const DB = process.env.DATABASE_Connection.replace(
  '<password>',
  process.env.DATABASE_Password
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  })
  .then(console.log('DB connection successful!'));
//------------------Read_File----------------//
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));
const skills = JSON.parse(fs.readFileSync(`${__dirname}/skills.json`, 'utf-8'));

const mentors = JSON.parse(
  fs.readFileSync(`${__dirname}/mentors.json`, 'utf-8')
);
const courses = JSON.parse(
  fs.readFileSync(`${__dirname}/courses.json`, 'utf-8')
);
const reviews = JSON.parse(
  fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8')
);
//--------------------CRUD------------------//
async function importData() {
  try {
    await skill.create(skills);
    await Course.create(courses);
    await Review.create(reviews);
    await User.create(users, { validateBeforeSave: false });
    await Mentor.create(mentors, { validateBeforeSave: false });
    console.log('Data successfully loaded!');
  } catch (err) {
    console.log(err);
  }
  process.exit();
}

async function deelteData() {
  try {
    await User.deleteMany();
    await skill.deleteMany();
    await Mentor.deleteMany();
    await Course.deleteMany();
    await Review.deleteMany();
    console.log('Data successfully deleted!');
  } catch (err) {
    console.log(err);
  }
  process.exit();
}
//--------------Run_Commands----------------//
if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deelteData();
}
