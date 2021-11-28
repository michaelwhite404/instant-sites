const express = require("express");
const path = require("path");
const morgan = require("morgan");
const pug = require("pug");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");

const siteRouter = require("./routes/siteRoutes");
const industryRouter = require("./routes/industryRoutes");
const viewRouter = require("./routes/viewRoutes");
const userRouter = require("./routes/userRoutes");
const AppError = require("./utils/AppError");
const globalErrorHandler = require("./controllers/errorController");

const app = express();

// Serving static files
app.set("view engine", "pug");
app.use(express.static(path.join(__dirname, "public")));

// Body Parser
app.use(express.json());
app.use(cookieParser());

// Development Logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Trailing Slash
app.use(function (req, res, next) {
  if (req.path.substr(-1) == "/" && req.path.length > 1) {
    let query = req.url.slice(req.path.length);
    res.redirect(301, req.path.slice(0, -1) + query);
  } else {
    next();
  }
});

// Limit requests from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000, // 60 minutes
});

app.use("/api", limiter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/sites", siteRouter);
app.use("/api/v1/industries", industryRouter);
app.use("/", viewRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
