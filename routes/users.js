const express = require("express");
const router = express.Router();

const bcrypt = require("bcrypt");

const key = require("../secret_key.json");
const authorize = require("../Components/Authorize");

router.post("/login", (req, res, next) => {
  const jwt = req.jwt;
  const { username, password } = req.body;
  if (!username || !password) {
    res.status(400).json({
      error: true,
      message: "Both username and password are required",
    });
    return;
  }

  req.db
    .select("*")
    .from("users")
    .where("UserName", username)
    .then((user) => {
      if (user.length === 0) {
        res
          .status(401)
          .json({ error: true, message: "Incorrect username or password" });
      } else {
        if (bcrypt.compareSync(password, user[0].Password)) {
          const expires_in = 60 * 60 * 3;
          const exp = Date.now() + expires_in * 1000;
          const token = jwt.sign({ username, exp }, key.key);
          res.status(200).json({
            token: token,
            token_type: "Bearer",
            expires_in: expires_in,
          });
        } else {
          res.status(401).json({
            error: true,
            message: "Incorrect username or password",
          });
        }
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: true, message: "SQL errors" });
    });
});

router.post("/create", authorize, (req, res, next) => {
  const data = req.body;

  const hashedPassword = bcrypt.hashSync(data.Password, 10);
  req.db
    .insert({
      UserName: data.UserName,
      Password: hashedPassword,
    })
    .into("users")
    .then(() => res.status(201).json({ error: false, message: "Success" }))
    .catch((err) => console.log(err));
});

router.put("/put", authorize, (req, res, next) => {
  const reqBody = req.body;
  console.log(reqBody);
});

module.exports = router;
