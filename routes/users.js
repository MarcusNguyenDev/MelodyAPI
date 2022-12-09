const express = require('express');
const router = express.Router();

const bcrypt = require("bcrypt");

const key = require('../secret_key.json');

const TempUserName = "admin";
const TempPassword = bcrypt.hashSync("Admin",10);


router.post('/login',(req,res,next)=>{
  const jwt=req.jwt;
  const { username,password } = req.body;
  if(!username||!password){
    res.status(400).json({
      error:true,
      message: "Both username and password are required"
    });
    return;
  }

  if (username === TempUserName && bcrypt.compareSync(password,TempPassword)) {
    const expires_in = 60*60*8;
    const exp = Date.now() + expires_in * 1000;
    const token = jwt.sign({username,exp},key.key);
      res.status(200).json({
        token:token,
        token_type:"Bearer",
        expires_in:expires_in
      });
  }else{
    res.status(401).json({
      error:true,
      message:"Incorrect username or password"
    });
  }
 
  // req.db.select("*").from("users").where({email:email}).then(user=>{
  //   if(user.length===0){
  //     res.status(401).json({
  //       error:true,
  //       message:"User not registered"
  //     });
  //     return;
  //   }
  //   const  hash  = user[0].password;

  //   if (!bcrypt.compareSync(password,hash)) {
  //     res.status(401).json({
  //       error:true,
  //       message:"Incorrect password"
  //     })
  //     return;
  //   }

  //   const expires_in = 60*60*24;

  //   const exp = Date.now() + expires_in * 1000;
  //   const token = jwt.sign({email,exp},key.key);
  //   res.status(200).json({
  //     token:token,
  //     token_type:"Bearer",
  //     expires_in:expires_in
  //   });
  // }).catch(err=>{
  //   console.log(err);
  //   res.status(500).json({
  //     error:true,
  //     message: "Error with SQL or something wrong with the server"
  //   });
  // });
});

module.exports = router;
