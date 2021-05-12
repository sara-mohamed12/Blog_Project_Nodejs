const Post=require('../models/PostModel')

const getAll = async (req, res,next) => {
  try{
      const Allposts = await Post.find({}).populate('author')
      res.render('index',{
        posts:Allposts,
        isLogged:req.session.userId
      }); 
  }catch(e){
     next(e)
  }
   
}

const editPost = async (req, res,next) => {
  try{
    const post = await Post.findById(req.params.id)
    res.render('editPost', {post:post});
  }catch(e){
     next(e)
  }
   
}

const updatePost=async(req,res,next)=>{
  if(req.file) req.body.photo=req.file.filename
  try{
    await Post.findByIdAndUpdate(req.params.id, req.body, { new: true }).exec();
    res.redirect('/profile');
  }catch(e){
     next(e)
  }
}

const deletePost=async(req,res,next)=>{
  try{
    await Post.findByIdAndDelete(req.params.id)
    res.redirect('/profile')
  }catch(e){
     next(e)
  }
}


const create = async (req, res, next) => {
  req.body.author=req.session.userId
  if(req.file) req.body.photo=req.file.filename
    try {
      const { body } = req;
      const postAdd = await Post.create(body);
      res.redirect('/posts')
    } catch (e) {
      next(e);
    }
  }

  module.exports = {
    create,getAll,editPost,updatePost,deletePost
  };