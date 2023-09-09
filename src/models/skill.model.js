const mongoose = require('mongoose');
//-------------------Schema----------------//
const skillsSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: [true, 'A skill must have a name']
    },
    description: {
        type: String,
        trim: true,
        required: [true, 'A skill must have a description']
    },
    logo: {
        type: String,
        trim: true,
        default: 'defaultSkill.jpg'
    }
});
//-------------------------Export-----------------------//
const Skill = mongoose.model('Skill', skillsSchema);
module.exports = Skill;
