const express = require('express');
const router = express.Router();

/* GET users listing. */
router.get('', function(req, res, next) {
  const servicetypeId=req.query.servicetypeId;

  if(Object.keys(req.query).length===0){
      req.db.select("*").from("services")
      .then(data=>{res.status(200).json(data)})
      .catch((err)=>{res.status(500).json({
        error:true,
        message:"SQL or internal server errors, please contatct software engineer"
    })});
  }else{
    if (Object.keys(req.query).length >1) {
      res.status(400).json({error:true,message:"Invalid query"});
          return;
    }
    if (Object.keys(req.query).length === 1) {
      if(!req.query.servicetypeId){
        res.status(400).json({error:true,message:"Invalid query"});
        return;
      }
    }
    
    req.db.select("*").from("services").where('ServiceTypeId','=',servicetypeId)
    .then(data=>{res.status(200).json(data)})
    .catch((err)=>{
      console.log(err);
      res.status(500).json({
      error:true,
      message:"SQL or internal server errors, please contatct software engineer"
    })});
  }
});

module.exports = router;
