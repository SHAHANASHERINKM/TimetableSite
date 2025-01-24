const mongoose = require("mongoose");

const MailToAllStudentSchema = new mongoose.Schema({
    subject:{
        type:String
    },
    message:{
        type:String
    }
})

const messageToAllStudentCollection = new mongoose.model("messageToAllStudents",MailToAllStudentSchema);

module.exports = messageToAllStudentCollection;