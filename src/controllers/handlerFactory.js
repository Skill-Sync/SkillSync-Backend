const catchAsyncError = require('./../utils/catchAsyncErrors');
const AppError = require('./../utils/appErrorsClass');
//------------handler functions ------------//
exports.getOne = (Model, populateOptions) => {
  return catchAsyncError(async (req, res, next) => {
    const doc = await Model.findById(req.params.id);
    if (!doc) return next(new AppError(`No ${Model} found with that ID`, 404));

    res.status(200).json({
      status: 'success',
      data: doc
    });
  });
};

exports.getAll = Model => {
  return catchAsyncError(async (req, res, next) => {
    const doc = await Model.find();
    if (!doc) return next(new AppError(`No ${Model} found at all`, 404));

    res.status(200).json({
      status: 'success',
      results: doc.length,
      data: doc
    });
  });
};

exports.createOne = Model => {
  return catchAsyncError(async (req, res, next) => {
    const doc = await Model.create(req.body);

    res.status(200).json({
      status: 'success',
      data: {
        data: doc
      }
    });
  });
};

exports.updateOne = Model => {
  return catchAsyncError(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!doc) return next(new AppError(`No ${Model} found with that ID`, 404));

    res.status(200).json({
      status: 'success',
      data: {
        data: doc
      }
    });
  });
};

exports.activateOne = Model => {
  return catchAsyncError(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, {
      active: true
    });
    if (!doc) return next(new AppError(`No ${Model} found with that ID`, 404));

    res.status(200).json({
      status: 'success',
      data: {
        data: doc
      }
    });
  });
};

exports.deactivateOne = Model => {
  return catchAsyncError(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) return next(new AppError(`No ${Model} found with that ID`, 404));

    res.status(204).json({
      status: 'success',
      data: null
    });
  });
};
