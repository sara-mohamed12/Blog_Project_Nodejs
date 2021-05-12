const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/blog",{

    useNewUrlParser: true,
    useUnifiedTopology: true,
    
  },(error)=>{
    if(error){
      console.log(error)
      return process.exit(1);
    }
    console.log("connected to database")
  }
);

