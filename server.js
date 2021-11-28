const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config({ path: "./config.env" });
const app = require("./app");

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB connection successful!"));
/* .then(() => {
    let db = mongoose.connection.db;

    return db
      .collection("sites")
      .updateMany({}, { $set: { fullName: `${this.firstName}` });
  }); */

const port = process.env.PORT || 7000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
