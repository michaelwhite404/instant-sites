const faker = require("faker");
const slugify = require("slugify");
const csv = require("csv-parser");
const fs = require("fs");
const { IncomingWebhook } = require("@slack/webhook");
const Site = require("../models/siteModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");
const APIFeatures = require("../utils/apiFeatures");
const Email = require("../utils/email");

// Read a url from the environment variables
const slackURL = process.env.SLACK_WEBHOOK_URL;

// Initialize
const webhook = new IncomingWebhook(slackURL);


const updateBy = (req) => {
  let updateOn = {};
  if (req.body.browser) {
    updateOn.customId = req.params.id;
  } else {
    updateOn._id = req.params.id;
  }

  return updateOn;
}

exports.getAllSites = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Site.find(), req.query)
    .filter()
    .sort()
    .limitWhats()
    .paginate();

  const sites = await features.query;

  res.status(200).json({
    status: "success",
    requestedAt: new Date(),
    count: sites.length,
    data: {
      sites,
    },
  });
});

exports.getSite = catchAsync(async (req, res, next) => {
  const site = await Site.findById(req.params.id);

  if (!site) {
    return next(new AppError("There is no site with that id", 404));
  }

  res.status(200).json({
    status: "success",
    requestedAt: new Date(),
    data: {
      site,
    },
  });
});

exports.createSite = catchAsync(async (req, res, next) => {
  req.body.createdBy = req.user;
  const newSite = await Site.create(req.body);

  const industrySlug = slugify(req.body.industry, { lower: true });

  var slackMessage = `New submission for a ${newSite.industry} Website
  
  Business Name: ${newSite.businessName || ""}
  Name: ${newSite.fullName || ""}
  Phone: ${newSite.phoneNumber || ""}
  Cell: ${newSite.cellPhone || ""}
  Email: ${newSite.email || ""}
  
  Street Address: ${newSite.streetAddress || ""}
  Suite: ${newSite.suite || ""}
  City: ${newSite.city || ""}
  State: ${newSite.state || ""}
  Zip: ${newSite.zip || ""}
  Country: ${newSite.country || ""}
  
  Link: http://127.0.0.1:9000/${industrySlug}/${newSite.customId}/${
    newSite.slug
  }`;

  await webhook.send({
    text: slackMessage,
  });

  res.status(201).json({
    status: "success",
    requestedAt: new Date(),
    data: {
      newSite,
    },
  });
});

exports.updateSite = catchAsync(async (req, res, next) => {
  if (req.body.businessName) {
    req.body.slug = slugify(req.body.businessName, { lower: true });
  }

  const updateOn = updateBy(req);

  const site = await Site.findOneAndUpdate(updateOn, req.body, {
    new: true,
    runValidators: true,
  });

  if (!site) {
    return next(new AppError("No site found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    requestedAt: new Date(),
    data: {
      site,
    },
  });
});

exports.deleteSite = catchAsync(async (req, res, next) => {
  const site = await Site.findByIdAndDelete(req.params.id);

  if (!site) {
    return next(new AppError("No site found with that ID", 404));
  }

  res.status(204).json({
    status: "success",
    requestedAt: new Date(),
    data: null,
  });
});

exports.setCurrentUserId = (req, res, next) => {
  // Allow nested routes
  if (!req.body.site) req.body.site = req.params.id;
  req.body.user = req.user.id;
  next();
};

exports.nextCount = (req, res, next) => {
  Site.nextCount(function (err, count) {
    // count === 0 -> true

    var site = new Site();
    site.save(function (err) {
      // site._id === 0 -> true

      site.nextCount(function (err, count) {
        // count === 1 -> true
        res.status(200).json({
          status: "success",
          requestedAt: new Date(),
          data: {
            next: count,
          },
        });
      });
    });
  });
};

exports.resetCount = (req, res, next) => {
  const site = new Site();
  // RESET AUTO-INCREMENT COUNT
  site.save(function (err) {
    // book._id === 100 -> true
    site.nextCount(function (err, count) {
      // count === 101 -> true
      site.resetCount(function (err, nextCount) {
        // nextCount === 100 -> true
        res.status(200).json({
          status: "success",
          requestedAt: new Date(),
          message: `Site ID has been reset to ${nextCount}`,
        });
      });
    });
  });
};

const fakeData = async (req) => {
  const fake = await new Site({
    businessName: faker.company.companyName(),
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    phoneNumber: faker.phone.phoneNumberFormat(1),
    email: faker.internet.email(),
    cellPhone: faker.phone.phoneNumberFormat(1),
    streetAddress: faker.address.streetAddress(),
    suite: faker.address.secondaryAddress(),
    city: faker.address.city(),
    state: faker.address.stateAbbr(),
    zip: faker.address.zipCode("#####"),
    country: "USA",
    industry: faker.random.arrayElement([
      "Landscaping",
      "Martial Arts",
      "HVAC",
    ]),
    createdAt: faker.date.between("2019-11-01", "2020-9-21"),
    createdBy: req.user,
  });
  fake.save();
  return fake;
};

exports.addFakeData = catchAsync(async (req, res, next) => {
  const fake = await fakeData(req);

  res.status(201).json({
    status: "success",
    requestedAt: new Date(),
    data: {
      fake,
    },
  });
});

exports.addMultipleFakeData = catchAsync(async (req, res, next) => {
  const number = req.params.number * 1;
  if (!Number.isInteger(number) || number < 2 || number > 99) {
    return next(
      new AppError(
        "The number must be an positive integer greater than 1 and less than 100",
        422
      )
    );
  }

  const sites = [];

  for (var i = 0; i < number; i++) {
    const site = await fakeData();
    sites.push(site);
  }

  res.status(201).json({
    status: "success",
    requestedAt: new Date(),
    count: sites.length,
    data: {
      sites,
    },
  });
});

exports.deleteAllSites = catchAsync(async (req, res, next) => {
  await Site.deleteMany({});

  res.status(204).json({
    status: "success",
    requestedAt: new Date(),
    data: null,
  });
});

exports.readCsv = (req, res, next) => {
  const results = [];

  fs.createReadStream("../../Downloads/Hvac in Waldorf, MD (Report by ).csv")
    .pipe(csv())
    .on("data", (data) => results.push(data))
    .on("end", () => {
      // console.log(results);
      
      res.status(200).json({
        status: "success",
        requestedAt: new Date(),
        data: {
          results,
        },
      });
    });
};

exports.sendInstantSite = catchAsync(async (req, res, next) => {
  const site = await Site.findById(req.params.id);
  try {
    const url = `${
      req.protocol
    }://127.0.0.1:9000/${site.industry.toLowerCase().split(" ").join("-")}/${
      site.customId
    }/${site.slug}`;

    await new Email(site, url).sendclientInstantSite();
    site.emailSent = true;

    res.status(200).json({
      status: "success",
      message: `Email sent to ${site.firstName || ""} ${site.lastName || ""} <${
        site.email
      }>`,
    });
  } catch {
    site.emailSent = false;
  }
});

exports.sendSMS = catchAsync(async (req, res, next) => {
  // Implement This Later
});
