const authRouter = require("express").Router();
const bodyParser = require("body-parser");
const authController =require("../controllers/auth.controller");
const check = require("express-validator").check

authRouter.get("/register" , authController.getRegister);

authRouter.post(
    "/register",
    bodyParser.urlencoded({ extended: true}),
    check('firstname')
        .not()
        .isEmpty().withMessage('Firstname is required'),
    check('lastname')
        .not()
        .isEmpty().withMessage('Lastname is required'),    
    check('email')
        .not()
        .isEmpty().withMessage('Email is required')
        .isEmail().withMessage('Invalid format'),
    check('password')
        .not()
        .isEmpty().withMessage('password is required')
        .isLength({min:6}).withMessage('password must be at least 6 characters'),
    authController.postRegister
);

authRouter.get("/login" , authController.getLogin);

authRouter.post(
    '/login',
    bodyParser.urlencoded({ extended: true }),
    authController.postLogin
)

authRouter.all("/logout",authController.logout)

authRouter.put('/follow:id',authController.followUser);


module.exports = authRouter;