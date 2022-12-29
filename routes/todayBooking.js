const express = require("express");
const router = express.Router();

const today = new Date();
const dd = String(today.getDate()).padStart(2, "0");
const mm = String(today.getMonth() + 1).padStart(2, "0");
const yyyy = today.getFullYear();
const date = yyyy + "/" + mm + "/" + dd;
/* GET users listing. */
router.get("/BookedServices", function (req, res, next) {
  console.log(date);
  req.db
    .select("*")
    .from("bookings")
    .where("BookingDate", date)
    .then((bookinglist) => {
      //const bookingIdList = bookinglist.map((data)=>({Id:data.Id,customer:data.Customer}));
      if (bookinglist.length === 0) {
        res.status(200).json([]);
      } else {
        const bookingIdList = bookinglist.map((data) => data.Id);
        req.db
          .select("*")
          .from("bookedservices")
          .whereIn("BookingId", bookingIdList)
          .then((data) => res.status(200).json(data))
          .catch((err) => {
            console.log(err);
            res.status(500).json({
              error: true,
              message: "Server error, please report to the software engineer",
            });
          });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: true,
        message: "Server error, please report to the software engineer",
      });
    });
});

router.get("/BookingList", (req, res, next) => {
  const reqDate = req.query.date;
  req.db
    .select("*")
    .from("bookings")
    .where("BookingDate", reqDate)
    .then((data) => res.status(200).json(data))
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: true,
        message: "Server error, please report to the software engineer",
      });
    });
});

router.get("/BookedServices/:id", (req, res, next) => {
  const id = req.params.id;
  req.db
    .select("*")
    .from("bookedservices")
    .where("BookingId", id)
    .then((data) => res.status(200).json(data))
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: true,
        message: "Server error, please report to the software engineer",
      });
    });
});

router.put("/BookedServices/setDone/:id", (req, res, next) => {
  const id = req.params.id;
  req.db
    .from("bookedservices")
    .update({
      Done: "YES",
    })
    .where("Id", id)
    .then(() => res.status(200).json({ error: false, message: "Success" }))
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: true,
        message: "Server error, please report to the software engineer",
      });
    });
});

router.put("/BookedServices/setUnDone/:id", (req, res, next) => {
  const id = req.params.id;
  req.db
    .from("bookedservices")
    .update({
      Done: "NO",
    })
    .where("Id", id)
    .then(() => res.status(200).json({ error: false, message: "Success" }))
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: true,
        message: "Server error, please report to the software engineer",
      });
    });
});

module.exports = router;
