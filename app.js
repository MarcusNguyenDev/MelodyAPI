const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const options = require("./knex.js");
const knex = require("knex")(options);
const jsonWebToken = require("jsonwebtoken");
const chalk = require("chalk");
const compression = require("compression");

const rateLimit = require("express-rate-limit");
const authorize = require("./Components/Authorize");
const cors = require("cors");

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const serviceTypeRouter = require("./routes/ServiceType");
const servicesRouter = require("./routes/services");
const bookingRouter = require("./routes/booking");
const checkTokenRouter = require("./routes/checkToken");
const todayBookingRouter = require("./routes/todayBooking");
const dashBoardRouter = require("./routes/dashboard");
const galleryRouter = require("./routes/gallery");

const app = express();
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(
  compression({
    filter: (req, res) => {
      if (req.headers["x-no-compression"]) {
        // don't compress responses with this request header
        return false;
      }
      // fallback to standard filter function
      return compression.filter(req, res);
    },
    level: 9,
    memLevel: 9,
    threshold: 0,
  })
);

app.use((req, res, next) => {
  req.db = knex;
  next();
});

app.use((req, res, next) => {
  req.jwt = jsonWebToken;
  next();
});

app.use(cors());
app.use(
  morgan(function (tokens, req, res) {
    return [
      chalk.white(tokens["date(Australia/Brisbane)"](req, res)),
      chalk.yellow(tokens["remote-addr"](req, res)),
      chalk.green.bold(tokens.method(req, res)),
      tokens.status(req, res) > 500
        ? chalk.red.bold(tokens.status(req, res))
        : tokens.status(req, res) < 500 && tokens.status(req, res) > 400
        ? chalk.yellow.bold(tokens.status(req, res))
        : tokens.status(req, res) < 400 && tokens.status(req, res) > 300
        ? chalk.blue.bold(tokens.status(req, res))
        : chalk.green.bold(tokens.status(req, res)),
      chalk.white(tokens.url(req, res)),
      chalk.yellow(tokens["response-time"](req, res) + " ms"),
    ].join(" ");
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/servicetypes", serviceTypeRouter);
app.use("/services", servicesRouter);
app.use("/booking", bookingRouter);
app.use("/checkToken", authorize, checkTokenRouter);
app.use("/todayBooking", authorize, todayBookingRouter);
app.use("/dashboard", authorize, dashBoardRouter);
app.use("/gallery", galleryRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  res.status(404).json({ error: true, message: "Page not found" });
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500).json({
    error: true,
    message:
      "Internal server error, contact the software engineer! The errors was handled by generic error handler",
  });
  res.render("error");
});

module.exports = app;
