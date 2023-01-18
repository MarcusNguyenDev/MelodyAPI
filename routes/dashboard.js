const express = require("express");
const router = express.Router();
const authorize = require("../Components/Authorize");

router.get("", authorize, (req, res, next) => {
  Promise.all();
});

module.exports = router;
