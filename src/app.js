const express = require("express");

const app = express() ;
//app.listen(7777);




app.use("/test",(req,res) => {
    res.send('Hello from test controller - changed ') ;
});

app.use('/hello',(req,res) => {
    res.send('Hello from hello controller') ;
});
app.use("/",(req,res) => {
    res.send('Hello from dashboard - changed') ;
});

app.listen(7777,() => {
    console.log('Server connected successfully') ;
})
 
