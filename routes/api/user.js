const express= require('express');
let router=express.Router();
var Users=require("../../models/users")
var bcrypt = require("bcryptjs");
const _ = require("lodash");
const citizenvalidater=require('../../middlewares/CitizenValidator')
const jwt = require("jsonwebtoken");


//get all users
router.get("/",async(req,res)=>{
    let user=await Users.find();
    return res.send(user);
});

//get a citizen against his idcard number
router.get('/:idcardnumber' ,async (req,res)=>
{
    try{
            let user= await Users.find({idcardnumber:req.body.idcardnumber})
            if(!user)
            {
                return res.status(400).send("User is not present");
            }    
            
            return res.send(user);

        }
    catch(err)
        {
            return res.status(400).send("Invalid ID");
        }

    });


// register citizen with required fields
router.post("/register",citizenvalidater,async(req,res)=>{
  console.log(req.body)
    
    let user = await Users.findOne({$or:[{email:req.body.email},{idcardnumber:req.body.idcardnumber}]});
    if (user) { return res.status(400).send("User with given Email or id cardnumber already exist"); }
    if(!req.body.name || !req.body.fathername || !req.body.idcardnumber || !req.body.phonenumber || !req.body.password
      || !req.body.email){
      return res.status("401").send("Fill all fields")
    }
    

          let newuser=new Users()  
        newuser.name=req.body.name;
        newuser.fathername=req.body.fathername;
        newuser.idcardnumber=req.body.idcardnumber;
        newuser.phonenumber=req.body.phonenumber;
        newuser.password=req.body.password;
        newuser.email=req.body.email;
        await newuser.generateHashedPassword();
        await newuser.save();
        let token = jwt.sign(
            { _id: newuser._id, name: newuser.name, role: newuser.role },"someprivatekey");
          let datareturn = {
            name: newuser.firstname,
            email: newuser.email,
            token: newuser.token,
          };
          return res.send(datareturn)
    
    
});

//login citizen with required field and generate tokem
router.post("/login", async (req, res) => {
    let user = await Users.findOne({  idcardnumber: req.body.cnic });
    if(!req.body.cnic || !req.body.password) return res.status(400).send("Enter all fields")
    if (!user) return res.status(401).send("User Not Registered");
    let isValid = await bcrypt.compare(req.body.password, user.password);
    if (!isValid) return res.status(402).send("Invalid Password");
    let token = jwt.sign(
      { _id: user._id, name: user.name, gmail: user.email,cnic:user.idcardnumber,mobile:user.phonenumber },"someprivatekey");
    res.send(token);
  });

  //payment module
  /*
  router.post("/payment",async(req,res)=>{

    return stripe.charges
    .create({
      amount: parseInt(req.body.amount*100), // Unit: cents
      currency: 'pkr',
      source: req.body.tokenId,
      description: 'Test payment',
    })
    .then(result => res.status(200).json(result));

  })
  */
module.exports=router;