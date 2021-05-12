const {User,createNewUser,login} = require("../models/authModel");
const validationResult = require('express-validator').validationResult


exports.getRegister = (req, res, next) => {
    res.render("register",{
        isLogged:req.session.userId,
        authError : req.flash('authError')[0],
        validationErrors: req.flash('validationErrors')
    });
};

exports.postRegister = (req, res, next) => {
    if(validationResult(req).isEmpty()){
        const {firstname,lastname,email,password}=req.body
         createNewUser(firstname,lastname, email, password)
        .then(() => res.redirect('/auth/login'))
        .catch(err => {
            req.flash('authError',err);
            res.redirect('/auth/register')
        })
    }else{
        req.flash('validationErrors',validationResult(req).array())
        res.redirect('/auth/register')
    }
   
};


exports.getLogin = (req, res, next) => {
    res.render("login",{
        isLogged:req.session.userId,
        authError : req.flash('authError')[0]
    });
};

exports.postLogin = (req,res,next) => {
     login(req.body.email,req.body.password)
    .then((user) => {
        req.session.userId=user._id
        req.session.username=user.username
        res.redirect("/posts")
    })
    .catch(err =>{
        req.flash('authError',err);
        res.redirect("/auth/login")
    })
};

exports.logout =(req,res,next)=>{
   req.session.destroy(()=>{
      res.redirect("/auth/login") 
   })
};

const Follow= async(req,res,follow)=>{
    await User.findByIdAndUpdate(req.session.userId,
        {$push:{following:req.params.id}},
        { new: true })
    User.findByIdAndUpdate(req.params.id,{follow:follow},{ new: true })
    .then(()=>res.status(200).redirect('/posts'))
}

const unFollow= async(req,res,follow)=>{
    await User.findByIdAndUpdate(req.session.userId,
        {$pull:{following:req.params.id}},
        { new: true })
       User.findByIdAndUpdate(req.params.id,{follow:follow},{ new: true })
        .then(()=>res.status(200).redirect('/posts'))
}

exports.followUser= async(req,res)=>{
    let authUser =await User.findById(req.session.userId).exec();
    let follow=false
    authUser.following.forEach(element=>{
        if(element == req.params.id ) follow=true
    })
    if(follow == false){
        Follow(req,res,follow)
        
    }else{
        unFollow(req,res,follow)
    }   
};


  
