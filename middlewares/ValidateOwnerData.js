var {validateownerdata}=require("../models/OwnerRecords")
async function validateownerdetails(req,res,next){
    let {error}= await validateownerdata(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    next()

}
module.exports=validateownerdetails;