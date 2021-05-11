var mongoose=require("mongoose");
const router = require("../routes/api/challans");
const Joi = require('joi');
var PaymentSchema=mongoose.Schema({
    registrationnumber: String,
    ownercnic:Number,
    ownergmail:String,
    ownernumber:Number,
    city:String,
    amount:Number,
    wardenid:Number,
    challanid:String,
    cardId:String,
    paidDate:{
        type:Date,
        default:Date.now()

    },
    issuDate:String,
    status: { type: String, default: "Paid" }
});
var Payment=mongoose.model("Payments",PaymentSchema);
function validatechallans(data)
{
    const schema=Joi.object({
     
       city: Joi.string().min(3).max(15).required(),
       ownercnic: Joi.number().min(13).max(13).required(),
       amount: Joi.number().min(13).max(13).required(),
       latitude: Joi.number().min(13).max(13).required(),
       longitude: Joi.number().min(13).max(13).required(),
       wardenid: Joi.String().min(13).max(13).required(),
       registrationnumber: Joi.string.min(7).max(15).required(),
    });
}
module.exports=Payment;
module.exports.validate=validatechallans;
