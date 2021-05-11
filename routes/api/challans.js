const express= require('express');
var router=express.Router();
var Records=require("../../models/OwnerRecords")
var Challans=require("../../models/challan");
var Payment=require("../../models/Payment")
const multipart = require('connect-multiparty');
const cloudinary = require('cloudinary');
const encode = require("nodejs-base64-encode");
const stripe = require('stripe')('sk_test_51H2YSHBx7QxnH8iBUdmg3PsmD3yWR0AzJy4aa7tqOzzhfcAIYt2BHElWPTOZ8jRNLulOv2LcxrHqtyDAVb5Wgmr2002tIoFIKp');
const Tesseract = require('tesseract.js');
const sharp = require('sharp');
const imageDownloader = require("image-downloader");
var nodemailer=require('nodemailer')
var sendgrid=require('nodemailer-sendgrid-transport')
//var CloudmersiveValidateApiClient = require('cloudmersive-validate-api-client');
var CloudmersiveImageApiClient = require('cloudmersive-image-api-client');
const { result } = require('lodash');
const { findByIdAndDelete, findById } = require('../../models/OwnerRecords');
//const { createDiffieHellman } = require('node:crypto');
const multipartMiddleware = multipart();


//cloudmersivevalidate application
var defaultClient = CloudmersiveImageApiClient.ApiClient.instance;

// Configure API key authorization: Apikey
var Apikey = defaultClient.authentications['Apikey'];
Apikey.apiKey = '0f70ea61-b708-4d5e-b679-667c46c53129';

var apiInstance = new CloudmersiveImageApiClient.RecognizeApi();
router.post('/up',multipartMiddleware,(req,res)=>{
  console.log(req.files.image.path)

  apiInstance.recognizeDetectVehicleLicensePlates(req.files.image.path, function(error,data,response){
    if(error){
      console.log(error)
    }else{
      console.log('API called successfully. Returned data: ' + data);
      res.send(data)
    }
  });

})

//var imageFile = Buffer.from(fs.readFileSync("C:\\temp\\inputfile").buffer); // File | Image file to perform the operation on.  Common file formats such as PNG, JPEG are supported.
/*var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};

*/


//use tesseract.js
router.post('/ups',multipartMiddleware,(req,res)=>{
  console.log(req.files.image.path)

  Tesseract.recognize(req.files.image.path)
      .then(function(result) {
        console.log(result.data.text)
       res.send(result.data.text);
      });
  

})
//get all unpaid agianst warden id
router.get("/unpaidbywarden/:id",async(req,res)=>{
  let challans=await Challans.find({$and:[{wardenid: req.params.id},{status:"Pending"}]})
  return res.send(challans)
})

//get all paid against warden id
router.get("/paidbywarden/:id",async(req,res)=>{
  let challans=await Challans.find({$and:[{wardenid: req.params.id},{status:"Paid"}]})
  return res.send(challans)
})
//get all challans unpaids
router.get("/allunpaid",async(req,res)=>{
  let challan=await Challans.find({status:'Pending'});
  return res.send(challan);
});

//all challan paid and unpaid
router.get("/",async(req,res)=>{
    let challan=await Challans.find();
    return res.send(challan);
});


//get challan against vehcile number plate
router.get("/:registrationnumber",async(req,res)=>{
    try
     { 
         let challan=await Challans.find({registrationnumber: req.params.registrationnumber});
 
         if(challan) 
         {
            return res.send(challan);           
         }
         else
         {
            return res.status(400).send("Challan is not found against that registration number");
      
         }
 
    }
    catch(err)
    {
        return res.status(400).send("INVALID entry");
    }
 });
//get all challan ahaint citizen cnic
router.get("/:ownercnic",async(req,res)=>{
    try
     { 
         let challan=await Challans.find({ownercnic: req.body.ownercnic});
 
         if(challan) 
         {
            return res.send(challan);           
         }
         else
         {
            return res.status(400).send("Challan is not found against that cnic");
      
         }
 
    }
    catch(err)
    {
        return res.status(400).send("INVALID entry");
    }
 });

//Cloudinary set up
cloudinary.config({
    cloud_name: 'ali7347',
    api_key: '431387519785511',
    api_secret: '8hvc3XL2nB2V24AdhxOUKVG7CO4'
});


//get dummy record
router.post('/dummy',async(req,res)=>{
  console.log(req.body)
  let postrecords="LER188486"
  let record=await Records.findOne({registrationnumber:postrecords})
  console.log(record)
 if(!record){
      res.status(400).send("Not found Records in database")
 }
else{
     res.send(record)
 }

})


//get the records against the photo of vehicle
router.post('/uploader',async(req, res)=> {
    //req.files.image.path
    //req.body.url
    console.log(req.body)
    //console.log(req.files.image.path)
    cloudinary.v2.uploader.upload(req.body.photo,
      {
        ocr: "adv_ocr"
      }, function(error, result) {
          if( result.info.ocr.adv_ocr.status === "complete" ) {
            let records=result.info.ocr.adv_ocr.data[0].textAnnotations[0].description
            console.log(records)
            let newrecords=records.replace(/(\r\n|\n|\r)/gm, "");
            let newpos= newrecords.replace(/-/g, "");
            //let mystring=newpos.trim()
            let mystring=newpos.split(" ").join("")
            let dataget=mystring.slice(0,9)
            console.log(dataget)
            res.send(dataget)
           
            

           
           // let cnicrecord=result.info.ocr.adv_ocr.data[0].textAnnotations[0].description // result.info.ocr.adv_ocr.data[0].textAnnotations[0].description (more specific)
          }
        })
     
         // let records=await Records.findOne({registrationnumber:postrecords})
         // if(!records){
         //      res.status(400).send("Not found Records in database")
         // }
         // else{
           //   res.send(records)
         // }
        

        
    

  }); 
  ////////////////////////
//this will get result from cloudinary all data will get by ocr
  router.post('/uploads',async(req, res)=> {
    //req.files.image.path
    //req.body.photo
    
    console.log(req.body.photo)
    cloudinary.v2.uploader.upload(req.body.photo,
      {
        ocr: "adv_ocr"
      }, function(error, result) {
          
          if( result.info.ocr.adv_ocr.status === "complete" ) { 
            let records=result.info.ocr.adv_ocr.data[0].textAnnotations[0].description
            //console.log(records)
            //let newrecords=records.replace(/(\r\n|\n|\r)/gm, "");
            //let newpos= newrecords.replace(/-/g, "");
            //let mystring=newpos.trim()
            //let mystring=newpos.split(" ").join("")
            //let dataget=mystring.slice(0,9)

            //console.log(dataget)
          // let postrecords=newrecords.slice(0,12)
          //let newpos= postrecords.replace(/-/g, "");
          //let newstring=newpos.trim()
          }
        })
           //res.send(dataget)     
           // let cnicrecord=result.info.ocr.adv_ocr.data[0].textAnnotations[0].description // result.info.ocr.adv_ocr.data[0].textAnnotations[0].description (more specific)
          .then(async result=>{
            let records=result.info.ocr.adv_ocr.data[0].textAnnotations[0].description
            let newrecords=records.replace(/(\r\n|\n|\r)/gm, "");
            let newpos= newrecords.replace(/-/g, "");
            //let mystring=newpos.trim()
            let mystring=newpos.split(" ").join("")
            let dataget=mystring.slice(0,9)
           if(!dataget){
             res.send("Not fetch data correctly")
           }

           let record=await Records.findOne({registrationnumber:dataget})
           console.log(record)
          if(!record){
               res.status(400).send("Not found Records in database")
          }
         else{
              res.send(record)
          }
        
          
        

        
        })

  }); 

//post a challan
router.post("/add",async(req,res)=>{
  console.log(req.body)
    let challan=new Challans();

    challan.registrationnumber= req.body.registrationnumber;
    challan.ownercnic= req.body.ownercnic;
    challan.ownername=req.body.name;
    challan.ownergmail=req.body.gmail;
    challan.ownernumber=req.body.number;
    challan.ownerfathername=req.body.ownerfathername;
    challan.city=req.body.city;
    challan.amount=parseInt(req.body.amount);
    challan.latitude=req.body.latitude;
    challan.longitude=req.body.longitude;
    challan.wardenid=req.body.wardenid;
    challan.challanid=req.body.challanid;
    await challan.save();
    return res.send(challan);
});

//get challans against specific warden id
router.get('/getall/:id',async(req,res)=>{
  console.log(req.params)

  let challans=await Challans.find({wardenid:req.params.id}).sort({issueDate:-1})
  if(challans){
    res.send(challans)
  }
  else{
    res.send('no record found')
  }

})

//get all unpaid challans against citizen cnic 
router.get('/getunpaid/:id',async(req,res)=>{
  console.log(req.params.id)
  let challans=await Challans.find({$and:[{ownercnic: req.params.id},{status:"Pending"}]}).sort({issueDate:-1})
  if(challans){
    res.send(challans)
  }
  else{
    res.send('no record found')
  }

})
//get all paid chalans against cnic
router.get('/getpaid/:id',async(req,res)=>{
  console.log(req.params.id)
  let challans=await Challans.find({$and:[{ownercnic: req.params.id},{status:"Paid"}]}).sort({paidDate:-1})
  if(challans){
    res.send(challans)
  }
  else{
    res.send('no record found')
  }

})

//delet pending challan
router.delete("/delchallan/:id",async(req,res)=>{
let challans=await Challans.deleteOne({'challanid':req.params.id})
if(challans){
res.send(challans)
console.log(challans)
}
else{
  res.send("not deleted")
}
})

//update payemnt when payment succcesfully then update pending staus of challan to paid
router.put("/updation/:id",async(req,res)=>{
console.log(req.bod)
  
  stripe.customers.create({
    email:'ali@gmail.com',
    source:req.body.tokenId
  }).then(customer=>{
  
    stripe.charges.create({
      amount:parseInt(req.body.amount*100),
      currency: 'pkr',
      customer:customer.id,
      receipt_email:customer.email,
      
    }).then(async result=> {
      
      let payment=await Challans.findById(req.params.id)
      payment.paidDate=Date.now()
      payment.status="Paid"
      payment.cardId=req.body.token.card.cardId;

      await payment.save();

 

      res.send(result)}).catch(err=>console.log(err))
    
   })
  


})


//payment module
router.post("/payment",async(req,res)=>{
  

  stripe.customers.create({
    email:'ali@gmail.com',
    source:req.body.tokenId
  }).then(customer=>{
  
    stripe.charges.create({
      amount:parseInt(req.body.amount*100),
      currency: 'pkr',
      customer:customer.id,
      receipt_email:customer.email,
      
    }).then(async result=> {
      
      let payment=new Payment();
      payment.registrationnumber=req.body.challan.registrationnumber;
      payment.ownercnic=req.body.challan.ownercnic;
      payment.ownergmail=req.body.challan.ownergmail;
      payment.ownernumber=req.body.challan.ownernumber;
      payment.city=req.body.challan.city;
      payment.amount=req.body.challan.amount;
      payment.ardenid=req.body.challan.wardenid;
      payment.challanid=req.body.challan.challanid;
      payment.issueDate=req.body.challan.issueDate;
      payment.cardId=req.body.token.card.cardId;

      await payment.save();

 

      res.send(result)}).catch(err=>console.log(err))
    
   })
  
  

  
});

//modemailer and sendgrid setup for sending mails
const transporter=nodemailer.createTransport(sendgrid({
  auth:{
    api_key:"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"
  }
}))


//padf file send via challan
router.post('/pdfuploader',(req,res)=>{
console.log(req.body.bases)
  
var base64File = encode.encode(req.body.bases, 'base64');
console.log(base64File)
  transporter.sendMail({
    to:"mhabibajmal@gmail.com",
    from:"fa17-bcs-003@cuilahore.edu.pk",
    subject:"request password code",
    html:`<h1>Password reset email </h1>`,
    attachments:[{content:base64File,filename:'MYChallan.pdf'}]
 
     
  })
  res.send("check you email")

})

/*
router.post('/upsdowns',async(req,res)=>{

  try {
     
    await sharp("images/lahoreplateimage.png").grayscale(1).png().toFile("images/edited-shap2.png");
     await sharp("images/edited-shap2.png").threshold(128).png().toFile("images/edited-shape2.png");


 } catch (error) {
     console.log(error);
 }


Tesseract.recognize(
  "images/lahoreplateimage.png",
 'eng',
{ logger: m => console.log(m) }
).then(({ data: { text } }) => {
console.log(text);

})

})*/


//post a challan 
router.post("/newpost" ,async function(req, res) {
  const options = {
    url:
      "https://res.cloudinary.com/ali7347/image/upload/v1619260469/vehicleimage_qeuko8.jpg",
   // dest: "C:/Users/USER/Desktop/final year project/myapp-master/public/images/hello.png",
   dest: "./public/images/hello.jpeg",

    // will be saved to /path/to/dest/image.jpg
  };
  
      imageDownloader
      .image(options)
      .then(({ filename }) => {
        
        
        console.log("file saved" + filename);
      })
      .catch((err) => console.error(err));

      (async function () {

        try {
           
           await sharp("./public/images/hello.jpeg").grayscale(1).jpeg().toFile("./public/images/edited-shap.jpeg");
            await sharp("./public/images/edited-shap.jpeg").threshold(100).jpeg().toFile("./public/images/edited-shape2.jpeg");
        
      
        } catch (error) {
            console.log(error);
        }
      
      })();

      Tesseract.recognize(
        './public/images/edited-shape2.jpeg',
        'eng',
        { logger: m => console.log(m) }
      ).then(({ data: { text } }) => {
        console.log("tetx is here",text)
        console.log(text.slice(2,5)+text.slice(11,15));
      }) 
     
   
});


router.post("/newch" ,async function(req, res) {
  let link=req.body.link
  const options = {
    url:
      link,
    dest: "./images/hello.png"
    // will be saved to /path/to/dest/image.jpg
  };
  
      imageDownloader
      .image(options)
      .then(async({ filename }) => {
        console.log("file saved" + filename);
        await sharp(filename).grayscale().png().toFile("./images/edited-shap2.png");
        await sharp("./images/hello.png").threshold(100).png().toFile("./images/edited-shape2.png");
        
      })
        Tesseract.recognize(
          './images/edited-shap2.png',
          'eng',
          { logger: m => console.log(m) }
        )
      .then(({ data: { text } }) => {
        console.log(text);
      }) 
      
   
});

module.exports=router;