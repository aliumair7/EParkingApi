var mongoose=require("mongoose");
var RecordsSchema=mongoose.Schema({
    registrationnumber: String,
    ownercnic:Number,
    ownername:String,
    ownerfathername:String,
    owneraddress:String,
    ownermobilenumber:Number,
    ownergmail:String,
    vehiclecolour:String,
    vehiclemodel:String,

    
});
var Records=mongoose.model("OwnerRecords",RecordsSchema,"OwnerRecords");

module.exports=Records;

