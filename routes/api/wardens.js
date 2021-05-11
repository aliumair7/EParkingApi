const express= require('express');
let router=express.Router();
var Wardens =require("../../models/warden")
var bcrypt = require("bcryptjs");
const _ = require("lodash");
const jwt = require("jsonwebtoken");
const wardenvalidator=require('../../middlewares/WardenValidator')
const { Router } = require('express');


//get all registered wardens
router.get("/",async(req,res)=>{
    let warden=await Wardens.find();
    return res.send(warden);
});
//get warden bagainst his  wardenid
router.get("/:wardenid",async(req,res)=>{
   try
    { 
        let warden=await Wardens.findOne({wardenid: req.params.wardenid});

        if(!warden) 
        {
            return res.status(400).send("Warden is not found in database");
        }
        else
        {
           return res.send(warden)
                
        }

   }
   catch(err)
   {
       return res.status(400).send("INVALID entry");
   }
});
// register warden with required fields
router.post("/register",wardenvalidator,async(req,res)=>{
    
    let warden = await Wardens.findOne({wardenid:req.body.wardenid});
    if (warden) {return res.status("400").send("Warden exists aalready with given wardenid ")}
  
      let newwarden=new Wardens()
        newwarden.name=req.body.name;
        newwarden.fathername=req.body.fathername;
        newwarden.wardenid=req.body.wardenid;
        newwarden.password=req.body.password;
        await newwarden.generateHashedPassword();
        await newwarden.save();
        let token = jwt.sign(
            { _id: newwarden._id, name: newwarden.name, wardenid: newwarden.newwardenid },"someprivatekey");
          let datareturn = {
            name: newwarden.name,
            wardenid: newwarden.wardenid,
            token: newwarden.token,
          };
          return res.send(datareturn)
    
    
});


//login warden with required field and generate token
router.post("/login", async (req, res) => {
    let warden = await Wardens.findOne({ wardenid: req.body.wardenid });
    if (!warden) return res.status(400).send("Warden Not Registered");
    let isValid = await bcrypt.compare(req.body.password, warden.password);
    if (!isValid) return res.status(401).send("Invalid Password");
    let token = jwt.sign(
      { _id: warden._id, name: warden.name, wardenid: warden.wardenid,role:warden.role,fathername:warden.fathername },"someprivatekey");
    res.send(token);
  });


//update warden aginst specfic wardenid
  router.put('/update/:id',async(req,res)=>{
    
    let wardens=await Wardens.findOne({wardenid:req.params.id})
    wardens.name=req.body.name;
    wardens.fathername=req.body.fathername;
    wardens.password=req.body.password;
    await wardens.save();
    res.send("Updated succuessfully")

  })
module.exports=router;