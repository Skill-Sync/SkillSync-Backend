const mongoose = require('mongoose');
//-------------------Schema----------------//
const skillsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A skill must have a name']
  },
  description: {
    type: String,
    required: [true, 'A skill must have a description']
  },
  logo: {
    type: String,
    default: 'defaultSkill.jpg'
  }
});
//-------------------------Export-----------------------//
const Skill = mongoose.model('Skill', skillsSchema);
module.exports = Skill;
