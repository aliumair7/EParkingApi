var mongoose=require("mongoose");
const router = require("../routes/api/challans");
const Joi = require('joi');
var challanSchema=mongoose.Schema({
    registrationnumber: String,
    ownercnic:Number,
    ownername:String,
    ownerfathername:String,
    ownergmail:String,
    ownernumber:Number,
    city:String,
    amount:Number,
    picid:String,
    latitude:Number,
    longitude :Number,
    wardenid:Number,
    challanid:String,
    cardId:String,
    placename:String,
    issueDate:{
        type:Date,
        default:Date.now()

    },
    paidDate:Date,
    status: { type: String, default: "Pending" }
});
var Challans=mongoose.model("Challan",challanSchema);
function validatechallans(data)
{
    const schema=Joi.object({
     
       city: Joi.string().min(3).max(15).required(),
       ownercnic: Joi.number().min(13).max(13).required(),
       amount: Joi.number().min(13).max(13).required(),
       latitude: Joi.number().min(13).max(13).required(),
       longitude: Joi.number().min(13).max(13).required(),
       wardenid: Joi.String().min(13).max(13).required(),
       issuedate: Joi.Date().utc().format(['DD-MM-YYYY']),
       registrationnumber: Joi.string.min(7).max(15).required(),
    });
}
module.exports=Challans;
module.exports.validate=validatechallans;
