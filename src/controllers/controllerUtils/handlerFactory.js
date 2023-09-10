const catchAsyncError = require('../../utils/catchAsyncErrors');
const AppError = require('../../utils/appErrorsClass');
const { standarizeUser, standarizeMentor } = require('../../utils/ApiFeatures');
//------------ Admin handler functions ------------//
exports.getAll = Model => {
    return catchAsyncError(async (req, res, next) => {
        const doc = await Model.find();
        if (!doc) return next(new AppError(`No ${Model} found at all`, 404));

        let docObj = {};

        if (`${Model}`.toLowerCase() === 'mentor') {
            docObj = doc.map(d => standarizeMentor(d));
        } else if (`${Model}`.toLowerCase() === 'user') {
            docObj = doc.map(d => standarizeUser(d));
        } else {
            docObj = doc;
        }

        res.status(res.locals.statusCode || res.locals.statusCode || 200).json({
            status: 'success',
            results: doc.length,
            data: docObj
        });
    });
};

exports.activateOne = Model => {
    return catchAsyncError(async (req, res, next) => {
        const doc = await Model.findByIdAndUpdate(req.params.id, {
            active: true
        });
        if (!doc)
            return next(new AppError(`No ${Model} found with that ID`, 404));

        let docObj = {};

        if (`${Model}`.toLowerCase() === 'mentor') {
            docObj = standarizeMentor(doc);
        } else if (`${Model}`.toLowerCase() === 'user') {
            docObj = standarizeMentor(doc);
        } else {
            docObj = doc;
        }

        res.status(res.locals.statusCode || 200).json({
            status: 'success',
            data: docObj
        });
    });
};

exports.deleteOne = Model => {
    return catchAsyncError(async (req, res, next) => {
        const doc = await Model.findByIdAndDelete(req.params.id);
        if (!doc)
            return next(new AppError(`No ${Model} found with that ID`, 404));

        res.status(res.locals.statusCode || 204).json({
            status: 'success',
            data: null
        });
    });
};
//------------ User handler functions -------------//
exports.getOne = Model => {
    return catchAsyncError(async (req, res, next) => {
        const doc = await Model.findById(req.params.id);
        if (!doc)
            return next(new AppError(`No ${Model} found with that ID`, 404));

        let docObj = {};

        if (`${Model}`.toLowerCase() === 'mentor') {
            docObj = standarizeMentor(doc);
        } else if (`${Model}`.toLowerCase() === 'user') {
            docObj = standarizeMentor(doc);
        } else {
            docObj = doc;
        }

        res.status(res.locals.statusCode || 200).json({
            status: 'success',
            data: docObj
        });
    });
};

exports.deactivateOne = Model => {
    return catchAsyncError(async (req, res, next) => {
        const doc = await Model.findByIdAndUpdate(req.params.id, {
            active: false
        });
        if (!doc)
            return next(new AppError(`No ${Model} found with that ID`, 404));

        res.status(res.locals.statusCode || 204).json({
            status: 'success',
            data: null
        });
    });
};
