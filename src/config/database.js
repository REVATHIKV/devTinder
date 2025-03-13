const mongoose = require('mongoose');
const connectDB = async() => {
   await mongoose.connect('mongodb+srv://revathikv90:Q0xwyOegVbAVIrL0@devtinder.n5tvc.mongodb.net/devTinder');
}
 

// connectDB()
// .then(()=>{
//     console.log('database connected successfully');
// })
// .catch((err) => {
//     console.error('database connection failed ');
// } )

module.exports = connectDB ;