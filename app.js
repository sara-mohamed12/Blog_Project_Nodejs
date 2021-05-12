const express = require('express');
const path=require('path')
const app = express()
const authRouter=require("./routes/authRouter")
const postRouter=require("./routes/postRouter")
const Post=require('./models/PostModel')
const authGuard=require('./routes/guards/auth.guard')
const authController=require('./controllers/auth.controller')
const session=require('express-session')
const SessionStore=require('connect-mongodb-session')(session)
const flash = require('connect-flash')
const methodOverride=require('method-override')
var bodyParser = require('body-parser');
const {User} = require("./models/authModel");


require("./helpers/connectToDb")

app.use(express.static(path.join(__dirname,'assets')))
app.use(express.static(path.join(__dirname,'images')))
app.use(methodOverride('_method'))
app.use(flash())

const STORE=new SessionStore({
    uri:"mongodb://localhost:27017/blog",
    collection:"sessions"
})

app.use(session({
    secret:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque tristique mauris non mattis vulputate.",
    saveUninitialized:false,
    resave: true,
    store:STORE
}))

app.set('view engine','ejs')
app.set('views','views')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use("/auth",authRouter);

app.use("/posts",postRouter);

app.get('/',authController.getRegister)

app.get('/profile',authGuard.isAuth,async(req,res,next)=>{
    try{ 
        const Allposts = await Post.find({author:req.session.userId})
        const user=await User.findById(req.session.userId)
        res.render('profile', {
            posts:Allposts,
            isLogged:req.session.userId,
            user:user
        });
      }catch(e){
         next(e)
      }
});

app.get('/following',authGuard.isAuth,async(req,res,next)=>{
    try{ 
        const authUser =await User.findById(req.session.userId).exec();
        var followerPosts = await Post.find({author: {$in: authUser.following}}).populate('author')
        res.render('following',{
            posts:followerPosts 
        })
      }catch(e){
         next(e)
      }
});


app.listen(3000,(err)=>{
    console.log("server listen on port 3000")
})