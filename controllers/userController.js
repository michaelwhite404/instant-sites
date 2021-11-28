const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const APIFeatures = require("../utils/apiFeatures");
const slugify = require("slugify");

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(User.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const users = await features.query;

  res.status(200).json({
    status: "success",
    requestedAt: new Date(),
    count: users.length,
    data: {
      users,
    },
  });
});

exports.getUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new AppError("There is no user with that id", 404));
  }

  res.status(200).json({
    status: "success",
    requestedAt: new Date(),
    data: {
      user,
    },
  });
});

exports.updateUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!user) {
    return next(new AppError("No user found with that ID", 404));
  }

  user.fullName = `${user.firstName} ${user.lastName}`;
  user.slug = slugify(`${user.fullName}`, { lower: true });
  await user.save({ validateBeforeSave: false });

  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});

exports.changeColorScheme = catchAsync(async (req, res, next) => {
  const user = await User.findById(res.locals.user._id);

  if (user.preferredColorScheme == "dark") user.preferredColorScheme = "light";
  else user.preferredColorScheme = "dark";

  await user.save({ validateBeforeSave: false });

  res.status(200).json({
    status: "success",
    message: `Color scheme has been changed to ${user.preferredColorScheme}`,
  });
});
