const express= require('express');
let router=express.Router();
var Locations=require("../../models/locations")

//get all no pakrking areas lattitude and longitudes
router.get("/markers",async(req,res)=>{

    let location=await Locations.find();
    return res.send(location);
});


//add marker for no parking areas on map by admin only
router.post('/addplace',async(req,res)=>{

    let location=new Locations()
    location.latitude=req.body.lat;
    location.longitude=req.body.long;
    await location.save()

    res.send("Add succfully")
})
module.exports=router;