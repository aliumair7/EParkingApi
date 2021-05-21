const express= require('express');
var router=express.Router();
var Records=require("../../models/OwnerRecords")
var  validateownerdetails =require('../../middlewares/ValidateOwnerData');

//post records of owner details against his vehicle registrationnumber
router.post("/addrecords",validateownerdetails,async (req,res)=>{
    let vehicle = await Records.findOne({registrationnumber : req.body.registrationnumber });
    if (vehicle) {return res.status("400").send("Vehicle Already Registered")}
    if(!req.body.registrationnumber || !req.body.ownercnic || !req.body.ownername 
        || !req.body.ownerfathername || !req.body.owneraddress
        || !req.body.ownermobilenumber || !req.body.ownergmail ||!req.body.vehiclecolour ||!req.body.vehiclemodel)
        {
        return res.status("401").send("Fill all fields")
      }

    let records=new Records()
    records.registrationnumber=req.body.registrationnumber;
    records.ownercnic=req.body.ownercnic;
    records.ownername=req.body.ownername;
    records.ownerfathername=req.body.ownerfathername;
    records.owneraddress=req.body.owneraddress;
    records.ownermobilenumber=req.body.ownermobilenumber;
    records.onwergmail=req.body.ownergmail;
    records.vehiclecolour=req.body.vehiclecolour;
    records.vehiclemodel=req.body.vehiclemodel;
    records=await records.save()

    return res.send(records)
      
})


//get all data against vehicle  registration number
router.get('/getrecords/:regno',async(req,res)=>{
    console.log(req.params)
    let records=await Records.findOne({registrationnumber:req.params.regno})
    if(!records){
         res.status(400).send("Not found Records in database")
    }
    else{
       return res.send(records)
    }

})


module.exports=router;