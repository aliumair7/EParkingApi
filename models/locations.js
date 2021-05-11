var mongoose=require("mongoose");

var locationSchema=mongoose.Schema({
    
    latitude:Number,
    longitude :Number,
    
});
var Locations=mongoose.model("Location",locationSchema);

module.exports=Locations;

