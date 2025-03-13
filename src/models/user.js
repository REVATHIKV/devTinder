const mongoose = require('mongoose')
const validator = require("validator");

const userSchema = mongoose.Schema({
    firstName:{type : String,
        required :true,
        minLength:4,
        maxLength:50,
        trim:true
    },
    lastName:{type : String},
    emailId:{ type: String, require: true, index:true, unique:true,sparse:true},
    gender:{type : String,
        validate(value){
            if(!["Male","Female","Others"].includes(value)){
                throw new Error("Invalid Gender")
            }
        }
    },
    age:{type : Number,
        validate(value){
if(value <18 ){
    throw new Error("Age should be above 18 !!")
}
        }
    },
    password : {type:String,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("Enter a strong password")
            }
        }
    } ,
    about:{type:String,
    default:"this is about user"
    } ,
    photoUrl:{type:String,validate(value){
       if(!validator.isURL(value)  ){
        throw new Error ("Invalid URL")
       }

    }}   
},{ timestamps: true }) ;

module.exports = mongoose.model('User',userSchema);