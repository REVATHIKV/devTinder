const express = require("express");
const cookieParser = require('cookie-parser')
const connectDB  = require("./config/database");
const app = express() ;
const cors = require('cors');



const authRouter  = require("./routers/auth");
const profileRouter  = require("./routers/profile");
const requestRouter  = require("./routers/request");
const userRouter = require("./routers/user")


app.use(express.json());
app.use(cookieParser());
//app.use(cors()); // Allow all origins (for dev)
  
app.use(cors({
  origin: 'http://localhost:5173', // Recommended: restrict to your frontend origin
  methods: ['GET', 'POST','PATCH'],
  credentials: true,
}));

app.use("/",authRouter )
app.use("/",profileRouter )
app.use("/",requestRouter )
app.use("/",userRouter )

connectDB()
.then(()=>{
console.log('Database connected successfully') ;
  

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

 
