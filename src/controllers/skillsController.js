const Skill = require('./../models/skillsModel');
const AppError = require('./../utils/appErrorsClass');
const factory = require('./controllerUtils/handlerFactory');
const catchAsyncError = require('./../utils/catchAsyncErrors');
// ---------- Basic CRUD Operations ----------//
exports.getSkill = factory.getOne(Skill);
exports.getAllSkills = factory.getAll(Skill);
exports.createSkill = factory.createOne(Skill);
exports.updateSkill = factory.updateOne(Skill);
exports.deleteSkill = factory.deleteOne(Skill);
