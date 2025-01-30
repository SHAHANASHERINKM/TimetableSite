const mongoose = require('mongoose');
const facultyloginSchema = new mongoose.Schema({
    name:{
      type:String,
      required:true
    },
    email:{
      type:String,
      required:true
    },
    phone:{
      type:String,
      required:true,
      set:function(value){
        return "+91"+value
      }
    },
    username:{
      type:String,
      required:true
      
    },
    password:{
      type:String,
      required:true
    },
    usertype:{
      type:String,
      required:true
    },
   
    
     
    });

    const facultyCollection=new mongoose.model('facultyloginCollection',facultyloginSchema)

    module.exports=facultyCollection