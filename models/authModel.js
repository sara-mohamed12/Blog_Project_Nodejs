const mongoose = require("mongoose");
const bcrypt = require('bcrypt');

const DB_URL = "mongodb://localhost:27017/blog";

const userSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true,
      },
    lastname: {
        type: String,
        required: true,
      },
    email: {
        type: String,
        required: true,
        unique: true
     },
    password: {
        type: String,
        required: true,
        minLength: 6,
      },
    following:[{type:mongoose.Schema.Types.ObjectId, ref: 'user'}] ,
    follow:{
        type:Boolean,
        default:true
    }
});


const User = mongoose.model("user", userSchema);

createNewUser = (firstname,lastname, email, password)=>{
    //check if email exists 
    return new Promise((resolve, reject) =>{
        User.findOne({email: email}).then(user => {
        if (user) {
            reject('Email is already taken');
        }
        else{
            return bcrypt.hash(password,10)
        }
        }).then(hashedPassword =>{
            let user = new User({
                firstname:firstname,
                lastname:lastname,
                email: email,
                password: hashedPassword,
            })
            return user.save()
        }).then(()=> {
            resolve()
        }).catch(err => {
            reject(err)
            console.log(err)
        })
    })  
};



login = ( email, password)=>{
    return new Promise((resolve, reject) =>{
        User.findOne({email: email}).then(user => {
        if (!user) {
            reject('There is no user matches this email');
        }else{
            bcrypt.compare(password,user.password).then(same => {
            if(!same){
                reject('Password is incorrect');
            }else{
                resolve(user)
            }
            })
        }
        }).catch(err => {
            mongoose.disconnect()
            reject(err)
        })
    });
};


module.exports={
    User,
    createNewUser,
    login
}





