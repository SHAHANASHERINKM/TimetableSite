const mongoose = require('mongoose');
const studentloginSchema = new mongoose.Schema({
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
    course:{
      type:String,
      required:true
    },
    semester:{
      type:String,
      required:true
    },
    });

    const studentCollection=new mongoose.model('studentloginCollection',studentloginSchema)

    module.exports=studentCollection