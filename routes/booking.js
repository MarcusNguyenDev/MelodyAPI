const express = require("express");
const router = express.Router();
const QRCode = require("qrcode");

const staffAvailable = 3;
const tuesdayStaffAvailable = 2;
const saturdayStaffAvailable = 3;

/* GET users listing. */

router.get("/available", function (req, res, next) {
  const date = req.query.date;
  if (new Date(date).getDay() === 0) {
    res.status(200).json([]);
    return;
  }

  req.db
    .select("*")
    .from("bookings")
    .where("BookingDate", "=", date)
    .whereNot("CheckedIn", "C")
    .then((data) => {
      if (data.length > 0) {
        const available = [];
        const BookingIdList = data.map((d) => d.Id);
        req.db
          .select("*")
          .from("bookedservices")
          .whereIn("BookingId", BookingIdList)
          .then((result) => {
            //Special for Thursday
            if (new Date(date).getDay() === 4) {
              for (let index = 0; index < 20; index++) {
                const count = result.filter((t) => {
                  return t.Time === index;
                });

                if (count.length < staffAvailable) {
                  available.push(index);
                }
              }
              res.status(200).json(available);
            }
            //Special for Saturday
            else if (new Date(date).getDay() === 6) {
              for (let index = 0; index < 14; index++) {
                const count = result.filter((t) => {
                  return t.Time === index;
                });

                if (count.length < 2) {
                  available.push(index);
                }
              }
              res.status(200).json(available);
            }
            //Special for Tuesday
            else if (new Date(date).getDay() === 2) {
              for (let index = 0; index < 14; index++) {
                const count = result.filter((t) => {
                  return t.Time === index;
                });
                if (count.length < tuesdayStaffAvailable) {
                  available.push(index);
                }
              }
              res.status(200).json(available);
            }
            //All other cases
            else {
              for (let index = 0; index < 17; index++) {
                const count = result.filter((t) => {
                  return t.Time === index;
                });
                if (count.length < staffAvailable) {
                  available.push(index);
                }
              }
              res.status(200).json(available);
            }
          })
          .catch((err) => {
            console.log(err);
            res.status(500).json({
              error: true,
              message: "Internal SQL error",
            });
          });
      } else {
        if (new Date(date).getDay() === 4) {
          res
            .status(200)
            .json([
              0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18,
              19,
            ]);
        } else if (new Date(date).getDay() === 6) {
          res.status(200).json([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]);
        } else {
          res
            .status(200)
            .json([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]);
        }
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: true,
        message: "Internal SQL error",
      });
    });
});

router.post("/bookv2", (req, res, next) => {
  const data = req.body;

  if (
    !data.selectedService ||
    !data.selectedDate ||
    !data.customerName ||
    !data.customerPhoneNumber
  ) {
    res
      .status(400)
      .json({ error: true, message: "Missing request object keys" });
    return;
  }

  req.db
    .insert({
      Customer: data.customerName,
      PhoneNumber: data.customerPhoneNumber,
      BookingDate: data.selectedDate,
      CheckedIn: "NO",
    })
    .into("bookings")
    .then((id) => {
      const bookingId = id[0];
      const BookedServices = data.selectedService.map((e) => ({
        BookingId: bookingId,
        ServiceId: e.ServiceId,
        Time: e.TimeId,
      }));
      req.db
        .insert(BookedServices)
        .into("bookedservices")
        .then(() =>
          QRCode.toDataURL(
            data.customerName +
              "|" +
              data.customerPhoneNumber +
              "|" +
              data.selectedDate,
            {
              width: 400,
            }
          ).then((url) =>
            res.status(201).json({ error: false, message: "Success", url: url })
          )
        )
        .catch((err) => {
          console.log(err);
          res.status(500).json({
            error: true,
            message: "Internal SQL error",
          });
          return;
        });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: true, message: "SQL error" });
    });
});

// This route is deprecated
router.post("/book", (req, res, next) => {
  const data = req.body;

  if (data.email === "") {
    res.status(400).json({
      error: true,
      message: "No given email address",
    });
    return;
  }

  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  if (!validateEmail(data.email)) {
    res.status(400).json({
      error: true,
      message: "Invalid email address",
    });
    return;
  }

  if (data.bookedServices.length === 0) {
    res.status(400).json({
      error: true,
      message: "No service selected",
    });
    return;
  }

  req.db
    .insert({
      Customer: data.email,
      BookingDate: data.date,
      CheckedIn: "NO",
    })
    .into("bookings")
    .then((id) => {
      const bookingId = id[0];
      const bookedServices = data.bookedServices;

      const BookedServices = bookedServices.map((d) => ({
        BookingId: bookingId,
        ServiceId: d.service.Id,
        Time: d.TimeId,
      }));

      req.db
        .insert(BookedServices)
        .into("bookedservices")
        .then(() =>
          res.status(200).json({
            error: false,
            Message: "Success",
          })
        )
        .catch((err) => {
          console.log(err);
          res.status(500).json({
            error: true,
            message: "Internal SQL error",
          });
          return;
        });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: true,
        message: "Internal SQL error",
      });
    });
});

module.exports = router;
