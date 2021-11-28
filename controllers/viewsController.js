const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");
const Site = require("../models/siteModel");
const Industry = require("../models/industryModel");
const User = require("../models/userModel");
const APIFeatures = require("../utils/apiFeatures");

exports.getHomePage = (req, res, next) => {
  res.status(200).render("login", {
    title: "Login",
  });
};

exports.getDashboardPage = (req, res, next) => {
  res.status(200).render("dashboard", {
    title: "Dashboard",
  });
};

exports.getInstantSitePage = (req, res, next) => {
  res.status(200).render("instantSites", {
    title: "Instant Sites",
  });
};

exports.getAllSitesPage = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Site.find(), req.query)
    .filter()
    .sort()
    .paginate();

  const sites = await features.query;
  const docs = await Site.countDocuments({});

  let { limit, page, sort, order } = features.queryString;
  if (!page) page = 1;
  if (!limit) limit = 25;
  if (!sort) sort = "createdAt";
  if (!order) order = "desc";
  const pages = Math.ceil(Number(docs / limit)) || 1;

  let title;
  if (page != 1 * 1) title = `Instant Sites - Sites | Page ${page}`;
  else title = "Instant Sites - Sites";

  res.status(200).render("allSites", {
    title,
    sites,
    page,
    pages,
    limit,
    sort,
    order,
  });
});

exports.getCreateSitePage = catchAsync(async (req, res, next) => {
  const industries = await Industry.find().sort("name");
  res.status(200).render("createSite", {
    title: "Create New Instant Site",
    industries,
  });
});

exports.getSitePage = catchAsync(async (req, res, next) => {
  const site = await Site.findOne({
    customId: req.params.customId,
    slug: req.params.slug,
  });

  if (!site) {
    return next(new AppError("No site found with that name", 404));
  }

  res.status(200).render("readSite", {
    title: `${site.businessName}`,
    site,
  });
});

exports.getEditSitePage = catchAsync(async (req, res, next) => {
  const site = await Site.findOne({
    customId: req.params.customId,
    slug: req.params.slug,
  });

  if (!site) {
    return next(new AppError("No site found with that name", 404));
  }

  res.status(200).render("editSite", {
    title: "Edit Instant Site",
    site,
  });
});

exports.getAllIndustriesPage = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Industry.find(), req.query)
    .filter()
    .sort("name")
    .paginate();

  const industries = await features.query;
  const docs = await Industry.countDocuments({});

  let { limit, page, sort, order } = features.queryString;
  if (!page) page = 1;
  if (!limit) limit = 25;
  const pages = Math.ceil(Number(docs / limit)) || 1;
  res.status(200).render("allIndustries", {
    title: "Instant Sites - Industries",
    industries,
    page,
    pages,
    limit,
  });
});

exports.getIndustryPage = catchAsync(async (req, res, next) => {
  const industry = await Industry.findOne({ slug: req.params.slug });

  if (!industry) {
    return next(new AppError("No industry found with that name", 404));
  }

  res.status(200).render("readIndustry", {
    title: `${industry.name}`,
    industry,
  });
});

exports.getEditIndustryPage = catchAsync(async (req, res, next) => {
  const industry = await Industry.findOne({ slug: req.params.slug });

  if (!industry) {
    return next(new AppError("No industry found with that name", 404));
  }

  res.status(200).render("editIndustry", {
    title: "Edit Industry",
    industry,
  });
});

exports.getCreateIndustryPage = (req, res, next) => {
  res.status(200).render("createIndustry", {
    title: "Create New Industry",
  });
};

exports.getAllUsersPage = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(User.find(), req.query)
    .filter()
    .sort("fullName")
    .paginate();

  const users = await features.query;
  const docs = await Industry.countDocuments({});

  let { limit, page, sort, order } = features.queryString;
  if (!page) page = 1;
  if (!limit) limit = 25;
  if (!sort) sort = "fullName";
  if (!order) order = "desc";
  const pages = Math.ceil(Number(docs / limit)) || 1;

  let title;
  if (page != 1 * 1) title = `Users | Page ${page}`;
  else title = "Users";

  res.status(200).render("allUsers", {
    title,
    users,
    page,
    pages,
    limit,
    sort,
    order,
  });
});

exports.getUserPage = catchAsync(async (req, res, next) => {
  const viewUser = await User.findOne({ slug: req.params.slug });

  if (!viewUser) {
    return next(new AppError("No user found with that name", 404));
  }

  res.status(200).render("readUser", {
    title: `${viewUser.fullName} - ${viewUser.title}`,
    viewUser,
  });
});

exports.getCreateUserPage = (req, res, next) => {
  res.status(200).render("createUser", {
    title: "Create New User",
  });
};

exports.getEditUserPage = catchAsync(async (req, res, next) => {
  const viewUser = await User.findOne({ slug: req.params.slug });

  if (!viewUser) {
    return next(new AppError("No user found with that name", 404));
  }

  res.status(200).render("editUser", {
    title: "Edit User",
    viewUser,
  });
});

exports.newPasswordPage = (req, res, next) => {
  res.status(200).render("newPassword", {
    title: "Change Your Password",
  });
};

exports.createBulkSitesPage = (req, res, next) => {
  res.status(200).render("createBulkSites", {
    title: "Create Bulk Instant Sites",
  });
};
