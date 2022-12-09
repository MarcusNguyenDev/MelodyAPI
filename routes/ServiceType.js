const express = require('express');
const router = express.Router();

/* GET users listing. */
router.get('', function(req, res, next) {
  req.db.select("*").from("servicetypes").then((st)=>{
    res.status(200).json(st)
  }).catch((err)=>{
    console.log(err);
    res.status(500).json({
        error:true,
        message:"SQL or internal server error, please contact the software engineer"
    });
  });
});

module.exports = router;
