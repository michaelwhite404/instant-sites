const mongoose = require("mongoose");
const slugify = require("slugify");

const industrySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
      required: true,
    },
    color: {
      type: String,
    },
    mainImage: {
      type: String,
    },
    slug: String,
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
    createdAt: {
      type: Date,
      default: new Date(),
      immutable: true,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
  // { collection: "industries" }
);

industrySchema.pre("save", function () {
  this.slug = slugify(this.name, { lower: true });
});

const Industry = mongoose.model("Industry", industrySchema);

module.exports = Industry;
