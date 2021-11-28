const Industry = require("../models/industryModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");
const APIFeatures = require("../utils/apiFeatures");

exports.getAllIndustries = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Industry.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const industries = await features.query;

  res.status(200).json({
    status: "success",
    requestedAt: new Date(),
    count: industry.length,
    data: {
      industries,
    },
  });
});

exports.getIndustry = catchAsync(async (req, res, next) => {
  const industry = await Industry.findById(req.params.id);

  if (!industry) {
    return next(new AppError("There is no industry with that id", 404));
  }

  res.status(200).json({
    status: "success",
    requestedAt: new Date(),
    data: {
      industry,
    },
  });
});

exports.createIndustry = catchAsync(async (req, res, next) => {
  const newIndustry = await Industry.create(req.body);

  res.status(201).json({
    status: "success",
    requestedAt: new Date(),
    data: {
      newIndustry,
    },
  });
});

exports.updateIndustry = catchAsync(async (req, res, next) => {
  const industry = await Industry.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!industry) {
    return next(new AppError("No industry found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    requestedAt: new Date(),
    data: {
      industry,
    },
  });
});

exports.deleteIndustry = catchAsync(async (req, res, next) => {
  const industry = await Industry.findById(req.params.id);

  if (!industry) {
    return next(new AppError("No industry found with that ID", 404));
  }

  res.status(204).json({
    status: "success",
    requestedAt: new Date(),
    data: null,
  });
});
