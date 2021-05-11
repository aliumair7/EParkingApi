var {validatewarden}=require("../models/warden")
async function wardenvalidator(req,res,next){
    let {error}= await validatewarden(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    next()

}
module.exports=wardenvalidator;