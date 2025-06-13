const validator = require("validator") ;

const validateSignup = (req) => {

    const { firstName, lastName, emailId, password} = req ;

    if(!firstName || !lastName || !emailId || !password){
        throw new Error("Fill all required fields") ;
    }
    if (! validator.isEmail(emailId)){
        throw new Error("Invalid Email Id") ;
    }

    if (! validator.isStrongPassword(password)){
        throw new Error("Please enter a strong password") ;
    }

}

const validateEditProfile =  (req) => {

const updateAllowed = ["firstName","lastName","age","gender","about","photoUrl","skills"] 

const isUpdateAllowed = Object.keys(req.body).every((field) => updateAllowed.includes(field)) ;

if(!isUpdateAllowed){
    throw new Error ("Invalid edit request")
}  






}

module.exports = {validateSignup,validateEditProfile} ;