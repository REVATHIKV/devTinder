const express = require("express")
const bcrypt = require("bcrypt")
const validator = require("validator")
const profileRouter = express.Router();
const {userAuth} = require("../middlewares/auth");

const {validateEditProfile} = require("../utils/validation") ;

profileRouter.get("/profile/view",userAuth, async (req,res) => {

    try{
    const user =  req.user ;
    
     res.json({message:"user details !!",data:user})

 
    //res.send("User profile")
  
    }catch(err){
  0
      res.status(404).send("somethiong went wrong !!" + err) 
  
    }
    
   })

   profileRouter.post("/profile/edit", userAuth, async (req,res) => {

    try{

      validateEditProfile(req) ;

      const loggedInUser = req.user ;

      const { firstName, lastName, age, gender,about,photoUrl, skills} = loggedInUser ; 
     

      //  if(about.length > 30){
      //   throw new Error("About should not exceed 30 characters")
      //  }

      Object.keys(req.body).forEach((field) => {loggedInUser[field] = req.body[field]}) ;
      await loggedInUser.save();

      res.json({message:"user updated successfully !!",data:loggedInUser})


    }
    catch(err){
      res.status(400).json({message:"somethiong went wrong !! " + err , data:''}) 
    }

   })

   profileRouter.patch("/profile/resetpassword", userAuth, async(req,res) => {

    try{
 
    const user = req.user 
     
    const isValidCurrentPassword = await user.isPasswordValid(req.body.currentPassword) ;
    const userInputPassword =  req.body.newPassword ;
    const {emailId,_id} = req.user ;
      // const isValidCurrentPassword = bcrypt.compare(userInputPassword, password) ;

console.log(isValidCurrentPassword);

if(!isValidCurrentPassword){
 throw new Error("Current password is incorrect")
}

if(!validator.isStrongPassword(userInputPassword)){
  throw new Error("Enter a strong password")
}

const passwordHash = await bcrypt.hash(userInputPassword,10);

 

user["password"] = passwordHash ;
await user.save();

res.send("Password changed successfully")

    }catch(err){
      res.status(400).send("somethiong went wrong !! " + err) 
    }

   })


   module.exports = profileRouter