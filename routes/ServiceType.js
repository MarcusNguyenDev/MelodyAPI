const express = require("express");
const router = express.Router();
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

const authorize = require("../Components/Authorize");

/* GET users listing. */
router.get("", function (req, res, next) {
  req.db
    .select("*")
    .from("servicetypes")
    .then((st) => {
      res.status(200).json(st);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: true,
        message:
          "SQL or internal server error, please contact the software engineer",
      });
    });
});

router.get("/:id", (req, res, next) => {
  const id = req.params.id;
  req.db
    .select("*")
    .from("servicetypes")
    .where("Id", id)
    .then((data) => {
      if (data.length === 0) {
        res.status(404).json({
          error: true,
          message: "Found no service type with that id",
        });
        return;
      }
      if (data.length === 1) {
        res.status(200).json(data[0]);
        return;
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: true,
        message:
          "SQL or internal server error, please contact the software engineer",
      });
    });
});

router.delete("/delete/:id", authorize, (req, res, next) => {
  const id = req.params.id;
  req.db
    .from("servicetypes")
    .where("Id", id)
    .del()
    .then(() =>
      res.status(200).json({
        error: false,
        message: "Deleted",
      })
    )
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: true,
        message: "SQL or internal server error",
      });
    });
});

router.post("/post", authorize, upload.single("image"), (req, res, next) => {
  // const test =upload.single("image");
  // test(req, res, function (err) {
  //   if (err instanceof multer.MulterError) {
  //     console.log(err)
  //   } else if (err) {
  //   console.log(err)
  //   }})
  console.log(!req.file);
  res.status(200).json({ message: "OK" });
});

module.exports = router;
