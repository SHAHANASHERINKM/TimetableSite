const mongoose = require("mongoose");

const MailToStudentSchema = new mongoose.Schema({
    course:{
        type:String
    },
    semester:{
        type:String
    },
    subject:{
        type:String
    },
    message:{
        type:String
    }
})

const messageToStudentCollection = new mongoose.model("messageToStudents",MailToStudentSchema);

module.exports = messageToStudentCollection;