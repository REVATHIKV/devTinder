const express = require("express");
const bcrypt = require("bcrypt");
const validator = require("validator") ;
const cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken')

//require("./config/database.js");
const connectDB  = require("./config/database");
const User  = require("./models/user");

const {validateSignup} = require("./utils/validation") ;
const {userAuth} = require("./middlewares/auth");
 
const app = express() ;


app.use(express.json());
app.use(cookieParser());
connectDB()
.then(()=>{
console.log('Database connected successfully') ;
//signup API
app.post("/signup", async (req,res,next) => {
 
 // new User() ;
try{

  const {firstName, lastName, emailId, password} = req.body ;

  const data = await User.findOne({emailId:emailId});
  if(data){
    throw new Error("Duplicate entry!! please check if the user is already registered or not")
  }
  const passwordHash = await bcrypt.hash(password,10);

  const user = new User({firstName, lastName, emailId, password:passwordHash})

  validateSignup(req.body) ;
  
 await user.save() 
res.send('User added successfully')
}catch(err){
  res.status(400).send("ERROR : "+err) ;
}

})


//login 

app.post('/login', async (req,res) => {
  try{
    const {emailId, password} = req.body ;

    if(!emailId || !password) {
      throw new Error("Enter credentials to login")
    } 

    if(!validator.isEmail(emailId)){
      throw new Error("Enter a valid Email Id")

    }
      const user = await User.findOne({emailId:emailId}) ;

    if(!user){
      throw new Error("Invalid Credentials");
    } 
 
    const isPasswordValid = await bcrypt.compare(password, user.password ) ;
      if(isPasswordValid){

        const token = jwt.sign({_id:user._id},"devTinder@123")

        console.log(token);
        res.cookie( "token",token);
        res.send("User logged in Successfully!!")
      }else{
        throw new Error("Invalid Credentials") ;
      }
    }
  catch(err){
res.status(400).send("ERROR : " + err)
  }
})


//user profile
app.get("/profile",userAuth, async (req,res) => {

  try{
  const user =  req.user ;
  
  res.send(user) ;
  //res.send("User profile")

  }catch(err){

    res.status(404).send("somethiong went wrong !!" + err) 

  }
  
 })

 app.post("/sendConnectionRequest",userAuth, async(req,res,next) => {

  try{

    const user = req.user ;

    res.send("Connection request sent by " + user.firstName) ;

  }catch(err){

  }

 })


//get list of all users
 app.get("/feed",async (req,res) => {

  

  try{
    const user = await User.find({});
    res.send(user) ;
  }catch(err){

    res.status(404).send("somethiong went wrong !!" + err) 

  }
  
 })

 //get list of users with email is
app.get("/user", async (req,res) => {

  console.log(req.body.emailId) ;
  const userEmail = req.body.emailId ;
try {
  const user = await User.find({emailId : userEmail}) ;
  if(user.length ===0){
res.status(404).send('User not found')
  }else{
    res.send(user);
  }
 
}
catch(err){
res.status(404).send('Something went wrong' + err)
}

})
//find one user with given email id
app.get("/findUser", async (req,res) => {

  

 const userEmail = req.body.emailId ;
try{
  const user = await User.findOne({emailId:userEmail})  ;
   
  if(user ==null ){
    res.status(404).send("user not found !! ") ;
  }else{
    res.send(user)
  }
}catch(err){
  res.status(404).send("something went wrong !!" + err) ;
}
 

})

//delete API
app.delete("/user",async (req,res) => {

  const userId = req.body.userId ;

  try{

 const data =  await User.findByIdAndDelete(userId) ;
console.log(data);
  res.send("User deleted successfully");
  

  }catch(err){
res.status(404).send("Something went wrong" + err)
  }
})

//update user data
app.patch("/user", async (req,res) => {
const userId = req.body.userId ;
try{
  //const userData = await User.findByIdAndUpdate(userId,req.body);
  const userData = await User.findOneAndUpdate({emailId:req.body.emailId},req.body);
  
  console.log(userData) ;
  res.send("data updated successfully") ;
}catch(err){
  res.status(404).send("something went wrong" + err) ;
}
})
 
    
app.listen(7777,() => {
  console.log('Server connected successfully') ;
})

})
.catch((err) => {
  console.log(err);
    console.error('Database connection failed')
}) 

 
