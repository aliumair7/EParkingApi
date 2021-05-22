var mongoose=require("mongoose");
var keysSchema=mongoose.Schema({
    wardenid:Number
   
});

var Keys=mongoose.model("LicenseKeys",keysSchema);

module.exports=Keys;