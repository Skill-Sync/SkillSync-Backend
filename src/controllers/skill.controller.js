const Skill = require('../models/skill.model');
const AppError = require('../utils/appErrorsClass');
const factory = require('./controllerUtils/handlerFactory');
const catchAsyncError = require('../utils/catchAsyncErrors');
const { filterObj } = require('../utils/ApiFeatures');
// ---------- Basic CRUD Operations ----------//
exports.getSkill = factory.getOne(Skill);
exports.getAllSkills = factory.getAll(Skill);
exports.deleteSkill = factory.deleteOne(Skill);
exports.createSkill = catchAsyncError(async (req, res, next) => {
    const skillObj = filterObj(req.body, 'name', 'description');

    const newSkill = await Skill.create(skillObj);

    res.status(res.locals.statusCdoe || 201).json({
        status: 'success',
        data: {
            newSkill
        }
    });
});

exports.updateSkill = catchAsyncError(async (req, res, next) => {
    const skillObj = filterObj(req.body, 'name', 'description', 'logo');

    const skill = await Skill.findByIdAndUpdate(req.params.id, skillObj, {
        new: true,
        runValidators: true
    });

    res.status(res.locals.statusCdoe || 200).json({
        status: 'success',
        data: {
            skill
        }
    });
});
