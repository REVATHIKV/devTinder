const mongoose = require('mongoose')
const validator = require("validator");
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")

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

    },
skills :{type:Array}}   
},{ timestamps: true }) ;


userSchema.methods.getJWT = async function(){
    const JWT_SECRET = process.env.JWT_SECRET ;
     
    const token =  jwt.sign({_id:this._id},JWT_SECRET) ;
     
 
    return token ;


}

userSchema.methods.isPasswordValid = async function(passwordInputByUser){

    const passwordHash =  this.password ;
    const isPasswordValid = await bcrypt.compare(passwordInputByUser,passwordHash) ;
    return isPasswordValid ;

}

module.exports = mongoose.model('User',userSchema);