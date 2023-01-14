const express = require("express");
const router = express.Router();
const authorize = require("../Components/Authorize");
const multer = require("multer");

const MulterStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/images");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const upload = multer({ storage: MulterStorage });

router.get("", (req, res, next) => {
  req.db
    .select("*")
    .from("gallery")
    .then((data) => res.status(200).json(data))
    .catch((err) => {
      console.log(err),
        res.status(500).json({ error: true, message: "SQL errors" });
    });
});

router.post("/post", authorize, upload.single("image"), (req, res, next) => {
  const data = req.body;

  if (!data.ServiceTypeId) {
    res
      .status(400)
      .json({ error: true, message: "Missing service type selection" });
    return;
  }

  if (!req.file) {
    res.status(400).json({ error: true, message: "Missing image" });
  } else {
    const fileName = req.file.filename;
    req.db
      .insert({
        ServiceTypeId: data.ServiceTypeId,
        ImageName: fileName,
      })
      .into("gallery")
      .then(() => res.status(201).json({ error: false, message: "Success" }))
      .catch((err) => {
        console.log(err);
        res.status(500).json({
          error: true,
          message: "SQL or internal server error",
        });
      });
  }
});

router.put("/delete/:id", (req, res, next) => {
  const id = req.params.id;
  if (!req.params.id) {
    res.status(400).json({
      error: true,
      message: "Missing id params",
    });
    return;
  }

  req.db
    .from("gallery")
    .where("Id", id)
    .del()
    .then(() => res.status(201).json({ error: false, message: "Success" }))
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: true, message: "SQL errors" });
    });
});

module.exports = router;
