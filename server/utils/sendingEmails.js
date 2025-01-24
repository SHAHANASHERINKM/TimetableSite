const nodemailer = require("nodemailer");
const messageToStudentModel = require("../models/maileToStudModel");
const messageToAllStudentModel = require("../models/mailToAllStudentModel");
//nodemailer stuff
const transporter = nodemailer.createTransport({
    service:"gmail",
    auth:{
        user:process.env.AUTH_EMAIL,
        pass:process.env.AUTH_PASS
    }
})

transporter.verify((error,success)=>{
    if(error){
        console.log(error);
    }else{
        console.log("Ready for messages");
        console.log(success);
    }
})

module.exports = {
    sendInfoEmail:async({course,semester,emails,subject,message},res)=>{
        try {
            console.log(emails)
            console.log(course)
            console.log(semester)
            console.log(subject)
            console.log(message)
            for(const recipient of emails){
                const mailOptions = {
                    from:process.env.AUTH_EMAIL,
                    to:recipient.email,
                    subject:subject,
                    html:`<p>${message}</p>`,
                }
                console.log(mailOptions);
                const newInfo = await new messageToStudentModel({
                    course:course,
                    semester:semester,
                    subject:subject,
                    message:message
                })
                await newInfo.save().then(async res=>{
                    console.log(res)
                    const info = await transporter.sendMail(mailOptions);
                }).catch(err=>{
                    console.log(err)
                });

            }
        } catch (error) {
             console.log(error);
        }
    },
    sendInfoEmailToAll:async({subject,message,emails},res)=>{
        try {
            console.log(emails)
            console.log(subject)
            console.log(message)
            for(const recipient of emails){
                const mailOptions = {
                    from:process.env.AUTH_EMAIL,
                    to:recipient.email,
                    subject:subject,
                    html:`<p>${message}</p>`,
                }
                console.log(mailOptions);
                const newInfo = await new messageToAllStudentModel({
                    subject:subject,
                    message:message
                })
                await newInfo.save().then(async res=>{
                    console.log(res)
                    const info = await transporter.sendMail(mailOptions);
                }).catch(err=>{
                    console.log(err)
                });

            }
        } catch (error) {
             console.log(error);
        }
    }
}
