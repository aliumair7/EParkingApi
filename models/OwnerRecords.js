var mongoose=require("mongoose");
const Joi = require('joi');
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
function validateownerdata(data)
{
    const schema=Joi.object({
        registrationnumber: Joi.string().min(3).max(30).required(),
        owneraddress: Joi.string().min(3).max(30).required(),
        vehiclecolour: Joi.string().min(3).max(30).required(),
        vehiclemodel: Joi.string().min(3).max(30).required(),
       ownername: Joi.string().min(3).max(30).required(),
       ownerfathername: Joi.string().min(3).max(30).required(),
       ownergmail: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
       ownercnic: Joi.string().length(13).pattern(/^[0-9]+$/).required(),
       ownermobilenumber: Joi.string().length(11).pattern(/^[0-9]+$/).required(),
       
      
    });
    return schema.validate(data,{abortEarly:false})
}

module.exports=Records;
module.exports.validateownerdata=validateownerdata;
