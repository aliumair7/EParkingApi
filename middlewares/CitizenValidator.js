var {validate}=require("../models/users")
async function citizenvalidater(req,res,next){
    let {error}= await validate(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    next()

}
module.exports=citizenvalidater;