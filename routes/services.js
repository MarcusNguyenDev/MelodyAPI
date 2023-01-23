const express = require("express");
const router = express.Router();
const authorize = require("../Components/Authorize");

/* GET users listing. */
router.get("", function (req, res, next) {
  const servicetypeId = req.query.servicetypeId;

  if (Object.keys(req.query).length === 0) {
    req.db
      .select("*")
      .from("services")
      .orderBy("ServiceTypeId", "asc")
      .then((data) => {
        res.status(200).json(data);
      })
      .catch((err) => {
        res.status(500).json({
          error: true,
          message:
            "SQL or internal server errors, please contatct software engineer",
        });
      });
  } else {
    if (Object.keys(req.query).length > 1) {
      res.status(400).json({ error: true, message: "Invalid query" });
      return;
    }
    if (Object.keys(req.query).length === 1) {
      if (!req.query.servicetypeId) {
        res.status(400).json({ error: true, message: "Invalid query" });
        return;
      }
    }

    req.db
      .select("*")
      .from("services")
      .where("ServiceTypeId", "=", servicetypeId)
      .then((data) => {
        res.status(200).json(data);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({
          error: true,
          message:
            "SQL or internal server errors, please contatct software engineer",
        });
      });
  }
});

router.get("/:id", (req, res, next) => {
  const id = req.params.id;
  req.db
    .select("*")
    .from("services")
    .where("Id", id)
    .then((data) => res.status(200).json(data[0]))
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: true, message: "Internal SQL error" });
    });
});

router.post("/post", authorize, (req, res, next) => {
  const reqBody = req.body;
  if (reqBody.ServiceName === "") {
    res.status(400).json({
      error: true,
      message: "Missing service name",
    });
    return;
  }

  if (reqBody.ServiceTypeId === "") {
    res.status(400).json({
      error: true,
      message: "missing service type",
    });
    return;
  }

  if (isNaN(reqBody.ServicePrice)) {
    res.status(400).json({
      error: true,
      message: "Price is not a number",
    });
    return;
  }
  req.db
    .insert(reqBody)
    .into("services")
    .then(() =>
      res.status(201).json({ error: false, message: "created new service" })
    );
});

router.put("/edit/:id", authorize, (req, res, next) => {
  const id = req.params.id;
  const reqbody = req.body;
  req.db
    .from("services")
    .where("Id", id)
    .update(reqbody)
    .then(() => res.status(200).json({ error: false, message: "Deleted" }))
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: true, message: "Internal SQL error" });
    });
});

router.put("/delete/:id", authorize, (req, res, next) => {
  const id = req.params.id;
  req.db
    .from("services")
    .where("Id", id)
    .del()
    .then(() => res.status(200).json({ error: false, message: "Deleted" }))
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: true, message: "Internal SQL error" });
    });
});

module.exports = router;
