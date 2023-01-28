const express = require("express");
const router = express.Router();

const today = new Date();
const dd = String(today.getDate()).padStart(2, "0");
const mm = String(today.getMonth() + 1).padStart(2, "0");
const yyyy = today.getFullYear();
const date = yyyy + "/" + mm + "/" + dd;
/* GET users listing. */

//BookingList
router.get("/BookingList", (req, res, next) => {
  const reqDate = req.query.date;
  if (!req.query.date) {
    res.status(400).json({ error: true, message: "Missing date" });
    return;
  }

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

router.get("/BookingList/Search", (req, res, next) => {
  if (!req.query.name && !req.query.phone) {
    res
      .status(400)
      .json({ error: true, message: "Name and Phone field are both empty" });
    return;
  }
  if (req.query.name !== "" && req.query.phone !== "") {
    // Both name and phone is given
    req.db
      .select("*")
      .from("bookings")
      .whereRaw(
        "lower(Customer) like ?",
        req.query.name.toLocaleLowerCase() + "%"
      )
      .andWhereRaw("PhoneNumber like ?", req.query.phone + "%")
      .orderBy("BookingDate", "desc")
      .then((data) => res.status(200).json(data))
      .catch((err) => {
        console.log(err);
        res.status(500).json({
          error: true,
          message: "Server error, please report to the software engineer",
        });
      });
  } else if (req.query.name !== "" && req.query.phone === "") {
    // Only name is given
    req.db
      .select("*")
      .from("bookings")
      .whereRaw(
        "lower(Customer) like ?",
        req.query.name.toLocaleLowerCase() + "%"
      )
      .orderBy("BookingDate", "desc")
      .then((data) => res.status(200).json(data))
      .catch((err) => {
        console.log(err);
        res.status(500).json({
          error: true,
          message: "Server error, please report to the software engineer",
        });
      });
  } else {
    // Only phone is given
    req.db
      .select("*")
      .from("bookings")
      .whereRaw("PhoneNumber like ?", req.query.phone + "%")
      .orderBy("BookingDate", "desc")
      .then((data) => res.status(200).json(data))
      .catch((err) => {
        console.log(err);
        res.status(500).json({
          error: true,
          message: "Server error, please report to the software engineer",
        });
      });
  }
});

router.get("/BookingList/Upcoming", (req, res, next) => {
  req.db
    .select()
    .from("bookings")
    .whereRaw("BookingDate >= CURDATE()")
    .orderBy("BookingDate", "asc")
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: true,
        message: "SQL errors, contact the software engineer for support",
      });
    });
});

router.get("/BookingList/:id", (req, res, next) => {
  const reqId = req.params.id;
  req.db
    .select("*")
    .from("bookings")
    .where("Id", reqId)
    .then((data) => res.status(200).json(data))
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: true,
        message: "Server error, please report to the software engineer",
      });
    });
});

router.put("/BookingList/cancel/:id", (req, res, next) => {
  const id = req.params.id;
  req.db
    .select("*")
    .from("bookings")
    .where("Id", id)
    .then((data) => {
      if (data[0].CheckedIn !== "C") {
        console.log(data.CheckedIn);
        req.db
          .from("bookings")
          .update({ CheckedIn: "C" })
          .where("Id", id)
          .then(() =>
            res.status(201).json({ error: false, message: "Success" })
          )
          .catch((err) => {
            console.log(err);
            res.status(500).json({
              error: true,
              message: "Server error, please report to the software engineer",
            });
          });
      } else {
        req.db
          .from("bookings")
          .update({ CheckedIn: "NO" })
          .where("Id", id)
          .then(() =>
            res.status(201).json({ error: false, message: "Success" })
          )
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

router.put("/BookingList/checkIn/:id", (req, res, next) => {
  const id = req.params.id;
  req.db
    .select("*")
    .from("bookings")
    .where("Id", id)
    .then((data) => {
      if (data[0].CheckedIn !== "YES") {
        req.db
          .from("bookings")
          .update({ CheckedIn: "YES" })
          .where("Id", id)
          .then(() =>
            res.status(201).json({ error: false, message: "Success" })
          )
          .catch((err) => {
            console.log(err);
            res.status(500).json({
              error: true,
              message: "Server error, please report to the software engineer",
            });
          });
      } else {
        req.db
          .from("bookings")
          .update({ CheckedIn: "NO" })
          .where("Id", id)
          .then(() =>
            res.status(201).json({ error: false, message: "Success" })
          )
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

// BookedServices
router.get("/BookedServices", function (req, res, next) {
  req.db
    .select("*")
    .from("bookings")
    .where("BookingDate", date)
    .whereNot("CheckedIn", "C")
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
