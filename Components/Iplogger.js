const Iplogger = function (req, res, next) {
  console.log(req.ip);
  next();
};

module.exports = Iplogger;
