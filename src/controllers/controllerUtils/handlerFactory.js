const catchAsyncError = require('../../utils/catchAsyncErrors');
const AppError = require('../../utils/appErrorsClass');
//------------ Admin handler functions ------------//
exports.getAll = Model => {
    return catchAsyncError(async (req, res, next) => {
        const doc = await Model.find();
        if (!doc) return next(new AppError(`No ${Model} found at all`, 404));

        res.status(res.locals.statusCode || res.locals.statusCode || 200).json({
            status: 'success',
            results: doc.length,
            data: doc
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

        res.status(res.locals.statusCode || 200).json({
            status: 'success',
            data: {
                data: doc
            }
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

        res.status(res.locals.statusCode || 200).json({
            status: 'success',
            data: doc
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
