const mongoose = require("mongoose");
const slugify = require("slugify");
const autoIncrement = require("mongoose-auto-increment");

const siteSchema = new mongoose.Schema(
  {
    businessName: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    fullName: {
      type: String,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    cellPhone: {
      type: String,
    },
    streetAddress: {
      type: String,
      required: true,
    },
    suite: {
      type: String,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    zip: {
      type: String,
      required: true,
    },
    country: {
      type: String,
    },
    slug: {
      type: String,
    },
    industry: {
      type: String,
      required: true,
      enum: ["Landscaping", "Martial Arts", "HVAC"],
    },
    fullAddress: {
      type: String,
    },
    customId: {
      type: Number,
      unique: true,
      immutable: true,
    },
    createdBy: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    status: {
      type: String,
      default: "Pending",
      required: true,
      enum: ["Sold", "Pending", "Declined"],
    },
    emailSent: {
      type: Boolean,
      default: false,
      required: true,
    },
    smsSent: {
      type: Boolean,
      default: false,
      required: true,
    },
    createdAt: {
      type: Date,
      immutable: true,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

siteSchema.pre("save", function () {
  let suite, afterStreetComma, afterSuiteComma;

  this.slug = slugify(this.businessName, { lower: true });

  if (this.suite) {
    suite = this.suite;
    afterStreetComma = "";
    afterSuiteComma = ", ";
  } else {
    suite = "";
    afterStreetComma = ",";
    afterSuiteComma = "";
  }

  this.fullAddress = `${this.streetAddress}${afterStreetComma} ${suite}${afterSuiteComma}${this.city}, ${this.state} ${this.zip}`;

  this.fullName = `${this.firstName} ${this.lastName}`;

  if (this.isNew) this.createdAt = new Date().toISOString();
  next();
});

autoIncrement.initialize(mongoose.connection);
siteSchema.plugin(autoIncrement.plugin, {
  model: "Site",
  field: "customId",
  startAt: 1,
  incrementBy: 1,
});

const Site = mongoose.model("Site", siteSchema);

module.exports = Site;
