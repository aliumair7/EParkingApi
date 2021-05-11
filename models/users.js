var mongoose=require("mongoose");
const Joi = require('joi');
var bcrypt = require("bcryptjs");
var userSchema=mongoose.Schema({
    name: String,
    fathername: String,
    email:String,
    idcardnumber:Number,
    phonenumber:Number,
    password:String,
});
userSchema.methods.generateHashedPassword = async function () {
    let salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  };
  
var Users=mongoose.model("Users",userSchema);
//Sign up Validation
function validateUsers(data)
{
    const schema=Joi.object({
       name: Joi.string().min(3).max(30).required(),
       fathername: Joi.string().min(3).max(30).required(),
       email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
       idcardnumber: Joi.string().length(13).pattern(/^[0-9]+$/).required(),
       phonenumber: Joi.string().length(11).pattern(/^[0-9]+$/).required(),
       password: Joi.string().min(3).max(10).required(),
      
    });
    return schema.validate(data,{abortEarly:false})
}

module.exports=Users;
module.exports.validate=validateUsers;