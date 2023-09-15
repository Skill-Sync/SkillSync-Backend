const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

const User = require('../../src/models/user.model');
const skill = require('../../src/models/skill.model');
const Mentor = require('../../src/models/mentor.model');
//-------------------Config----------------//
dotenv.config({ path: path.join(__dirname, '..', '..', 'config.env') });
//--------------------DB-------------------//
const DB = process.env.DATABASE_Connection.replace(
    '<password>',
    process.env.DATABASE_Password
);

mongoose
    .connect(DB, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(console.log('DB connection successful!'));
//------------------Read_File----------------//
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));
const skills = JSON.parse(fs.readFileSync(`${__dirname}/skills.json`, 'utf-8'));
const mentors = JSON.parse(
    fs.readFileSync(`${__dirname}/mentors.json`, 'utf-8')
);

//--------------------CRUD------------------//
async function importData() {
    try {
        await skill.create(skills);
        await User.create(users, { validateBeforeSave: false });
        await Mentor.create(mentors, { validateBeforeSave: false });
        console.log('Data successfully loaded!');
    } catch (err) {
        console.log(err);
    }
    process.exit();
}

async function deleteData() {
    try {
        await User.deleteMany();
        await skill.deleteMany();
        await Mentor.deleteMany();
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
    deleteData();
}
