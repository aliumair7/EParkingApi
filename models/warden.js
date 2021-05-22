var mongoose=require("mongoose");
const router = require("../routes/api/wardens");
const Joi = require('joi');
var bcrypt = require("bcryptjs");
var wardenSchema=mongoose.Schema({
    name: String,
    fathername: String,  
    wardenid:Number,
    password:String,
    role:{
      type:String,
      default:"Warden"

  },
});
wardenSchema.methods.generateHashedPassword = async function () {
    let salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  };
  
var Wardens=mongoose.model("Warden",wardenSchema);
//Sign up Validation
function validatewarden(data)
{
    const schema=Joi.object({
       name: Joi.string().min(3).max(30).required(),
       fathername: Joi.string().min(3).max(30).required(),
        password: Joi.string().min(3).max(10).required(),
        wardenid: Joi.number().required(),
     
      
    });
    return schema.validate(data,{abortEarly:false})
}
//Login validation
function validatewardenlogin(data)
{
    const schema=Joi.object({
      wardenid: Joi.number().min(13).max(13).required(),
      password: Joi.string().min(3).max(10).required(),
     
    });
}
module.exports=Wardens;
module.exports.validatewarden=validatewarden;
module.exports.validatewardenlogin=validatewardenlogin;