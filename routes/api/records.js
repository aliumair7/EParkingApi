const express= require('express');
var router=express.Router();
var Records=require("../../models/OwnerRecords")

//post records of owner details against his vehicle registrationnumber
router.post("/addrecords",async (req,res)=>{
    let records=new Records()
    records.registrationnumber=req.body.registrationnumber;
    records.ownercnic=req.body.cnic;
    records.ownername=req.body.name;
    records.ownerfathername=req.body.fathername;
    records.owneraddress=req.body.address;
    records.onwermobilenumber=req.body.mobilenumber;
    records.onwergmail=req.body.gmail;
    records.vehiclecolour=req.body.vehiclecolour;
    records.vehiclemodel=req.body.vehiclemodel;
    records=await records.save()

    res.send(records)

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