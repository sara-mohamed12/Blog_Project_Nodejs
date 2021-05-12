const mongoose = require('mongoose');

const getDate = ()=>{
    let d=new Date();
    let month = d.toLocaleString('en-us', { month: 'long' });
    date= `${month}${d.getDate()},${d.getFullYear()}`
    return date;  
}

const PostSchema = new mongoose.Schema({
    title: {
        type: String,
        maxLength: 256,
        required: true,
      },
    createdAt: {
        type: String,
        default: getDate()
      },
    photo:{
      type: String,
      default:"/images/download.png"
    },
    content: {
        type:String,
        required: true,
    },
    // author:String,
    // user_id: {
    //   type: mongoose.Schema.Types.ObjectId 
    // }
    author:{type:mongoose.Schema.Types.ObjectId, ref: 'user'}
});

const Post = mongoose.model('Post', PostSchema);

module.exports = Post;