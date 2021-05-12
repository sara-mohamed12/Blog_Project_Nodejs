const express = require('express')
const postRouter = express.Router()
const multer=require('multer')
const {create,getAll,editPost,updatePost,deletePost} = require('../controllers/post.controller')
const authGuard=require('./guards/auth.guard')


postRouter.get('/new',authGuard.isAuth, async (req, res, next) => {
  try {
    res.render('createPost')
  } catch (e) {
    next(e);
  }
});

postRouter.get('/edit/:id',editPost);

postRouter.delete('/:id',deletePost);

postRouter.put('/:id',multer({
  storage:multer.diskStorage({
    destination:(req,file,func)=>{
      func(null,'images')
    },
    filename:(req,file,func)=>{
      func(null,Date.now() + '-' + file.originalname)
    }
  })
}).single('photo'),updatePost);


postRouter.post('/store',multer({
  storage:multer.diskStorage({
    destination:(req,file,func)=>{
      func(null,'images')
    },
    filename:(req,file,func)=>{
      func(null,Date.now() + '-' + file.originalname)
    }
  })
}).single('photo'),create);

postRouter.get('/', getAll);


module.exports = postRouter