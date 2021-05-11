var mongoose=require("mongoose");
const router = require("../routes/api/cars");
const Joi = require('joi');
var carSchema=mongoose.Schema({
    carname: String,
    carcolour:String,
    carmakername:String,
    model: String,
    registrationnumber: String,
    enginenumber: Number,
    chasienumber:String,
    manufactureyear:Date,
    enginecc:Number,
    ownercnic:Number,
});
var Cars=mongoose.model("Cars",carSchema);
function validatecars(data)
{
    const schema=Joi.object({
       caramkername: Joi.string().min(3).max(30).required(),
       carname: Joi.string().min(3).max(15).required(),
       carcolour: Joi.string().min(3).max(15).required(),
       ownercnic: Joi.number().min(13).max(13).required(),
       enginenumber: Joi.number().min(13).max(13).required(),
       chasienumber: Joi.number().min(13).max(13).required(),
       model: Joi.String().min(13).max(13).required(),
       enginencc: Joi.number().min(3).max(4).required(),
       manufactureyear: Joi.Date.format('YYYY').required(),


    });
}
module.exports=Cars;
module.exports.validate=validatecars;
