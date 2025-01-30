require('../models/database');
require("../utils/findScheduleForMsg");
require("../utils/sendingPeriodRemainders");
const studentCollection = require('../models/studentUser');
const facultyCollection = require('../models/facultyUser');
const notificationCollection = require("../models/maileToStudModel");
const bcrypt = require("bcrypt");
// Import collections
// const { mcaS1collection,mcaS2collection,mcaS3collection,mcaS4collection,
//   mscS1collection,mscS2collection,mscS3collection,mscS4collection 
// } = require('../models/timetable');
const {getTimetablesForTutor,getAllTimetables,
       currentDayTimeTable,getStudentEmail,
       getAllStudentEmail,getAllTimetablesForHOD,
       getTimeTableByeId,editAndUpdatedTable,
       addTimeTable,getNotification} = require("../utils/filterFacultyTimeTable");
const {sendInfoEmail,sendInfoEmailToAll} = require("../utils/sendingEmails");
const { get } = require('mongoose');


// Dynamic collection mapping
// const collectionMapping = {
//     "MCA-S1": mcaS1collection,
//     "MSC-S1": mscS1collection,
//     "MCA-S2": mcaS2collection,
//     "MSC-S2": mscS2collection
// };

module.exports = {
    Home:async(req,res)=>{
      res.render("index",{usermode:req.session});
    },
    login: async(req,res)=>{
        res.render("login", { errors: {}, username: "" });
       
    },
    role:async(req,res)=>{
        res.render('role')
    },

    signup: async(req,res)=>{

      const { usertype } = req.body; 
      const errors = {}
      if(!usertype){
        errors.usertype = "usertype is required";
      }
      if (Object.keys(errors).length > 0) {
        return res.render("role",{errors});
      }

      if(usertype==='Student'){
        res.render("studentSignup");
      }
      else if(usertype==='Faculty'){
        res.render("facultySignup");
      }
      else{
        res.render("facultySignup");
      }
    },

    studentSignup_validation: async(req,res)=>{
        const data = req.body;  // Store the entire request body
        const { name, email, phone, username, password, usertype,course, semester } = data;  // Destructure individual fields from `data`
        const errors = {};
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const phoneRegex = /^[0-9]{10}$/;

        // Validate input fields
        if (!name) {
            errors.name = "*Name is required.";
        }
        if (!email) {
            errors.email = "*Email is required.";
        }else if(!emailRegex.test(email)){
            errors.email = "*Please enter a valid email address.";
        }
        if (!phone) {
            errors.phone = "*Phone number is required.";
        }else if(!phoneRegex.test(phone)){
            errors.phone = "*Please enter a valid 10-digit phone number.";
        }
        if (!username) {
            errors.username = "*Username is required.";
        }
        if (!password) {
            errors.password = "*Password is required.";
        }
        if (!usertype) {
          errors.usertype = "*Usertype is required.";
      }
        if (!course) {
            errors.course = "*Course is required.";
        }
        if (!semester) {
            errors.semester = "*Semester is required.";
        }
     
        // If there are validation errors, re-render the signup page with error messages
        if (Object.keys(errors).length > 0) {
            return res.render("studentSignup", {
            errors, 
            username: req.body.username, 
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            password: req.body.password,
            course: req.body.course,
            semester: req.body.semester,
            });
        }

        try {
            // Check if the username already exists in the database
            const existingUser = await studentCollection.findOne({ username });
            const existingEmail = await studentCollection.findOne({email});

            // If the username exists, return an error message
            if (existingUser) {
            errors.username = "Username already taken. Please choose another one.";
            return res.render("studentSignup", {
                errors, 
                username: req.body.username, 
                name: req.body.name,
                email: req.body.email,
                phone: req.body.phone,
                password: req.body.password,
                course: req.body.course,
                semester: req.body.semester
            });
            }
            if (existingEmail) {
              errors.email = "Email already taken. Please choose another one.";
              return res.render("studentSignup", {
                  errors, 
                  username: req.body.username, 
                  name: req.body.name,
                  email: req.body.email,
                  phone: req.body.phone,
                  password: req.body.password,
                  course: req.body.course,
                  semester: req.body.semester
              });
              }
            const saltround = 10;
            const hashedpassword = await bcrypt.hash(data.password,saltround);
            data.password = hashedpassword
            console.log(data);
            // Insert data into the database
            await studentCollection.insertMany([data]);

            // Redirect to welcome page
            res.render("login", { name: data.name });
        } catch (error) {
          
            console.error("Error during signup:", error);
            res.send("Error during signup. Please try again.");
        }
            },

            facultySignup_validation: async(req,res)=>{
              const data = req.body;  // Store the entire request body
              const { name, email, phone, username, password, usertype } = data;  // Destructure individual fields from `data`
              const errors = {};
              const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
              const phoneRegex = /^[0-9]{10}$/;
      
              // Validate input fields
              if (!name) {
                  errors.name = "*Name is required.";
              }
              if (!email) {
                errors.email = "*Email is required.";
              }else if(!emailRegex.test(email)){
                errors.email = "*Please enter a valid email address.";
              }
              if (!phone) {
                errors.phone = "*Phone number is required.";
              }else if(!phoneRegex.test(phone)){
                errors.phone = "*Please enter a valid 10-digit phone number.";
              }
              if (!username) {
                  errors.username = "*Username is required.";
              }
              if (!password) {
                  errors.password = "*Password is required.";
              }
              if (!usertype) {
                errors.usertype = "*Usertype is required.";
            }
              
      
              // If there are validation errors, re-render the signup page with error messages
              if (Object.keys(errors).length > 0) {
                  return res.render("facultySignup", {
                  errors, 
                  username: req.body.username, 
                  name: req.body.name,
                  email: req.body.email,
                  phone: req.body.phone,
                  password: req.body.password,
                  usertype: req.body.usertype,
                 
                  });
              }
      
              try {
                  // Check if the username already exists in the database
                  const existingUser = await facultyCollection.findOne({ username });
                  const existingEmail = await facultyCollection.findOne({email});
      
                  // If the username exists, return an error message
                  if (existingUser) {
                  errors.username = "Username already taken. Please choose another one.";
                  return res.render("facultySignup", {
                      errors, 
                      username: req.body.username, 
                      name: req.body.name,
                      email: req.body.email,
                      phone: req.body.phone,
                      password: req.body.password,
                      usertype: req.body.usertype,
                      
                  });
                  }
                  if (existingEmail) {
                    errors.username = "Email already taken. Please choose another one.";
                    return res.render("facultySignup", {
                        errors, 
                        username: req.body.username, 
                        name: req.body.name,
                        email: req.body.email,
                        phone: req.body.phone,
                        password: req.body.password,
                        usertype: req.body.usertype,
                        
                    });
                    }
                  const saltround = 10;
                  const hashedpassword = await bcrypt.hash(data.password,saltround);
                  data.password = hashedpassword
                  // Insert data into the database
                  const result = await facultyCollection.insertMany([data]);
                  console.log(result);
                  // Redirect to welcome page
                  res.render("login",{name:data.name});
              } catch (error) {
                  console.error("Error during signup:", error);
                  res.send("Error during signup. Please try again.");
              }
                  },
      login_validation: async(req,res)=>{
                const { username, password,usertype } = req.body;
                const errors = {};
                console.log(req.body);
                // Validate input fields
                if (!username) {
                  errors.username = "*Username is required.";
                }
                if (!password) {
                  errors.password = "*Password is required.";
                }
                if (!usertype) {
                  errors.usertype = "*Role is required.";
                }
              
                // If there are validation errors, re-render the login page with error messages
                if (Object.keys(errors).length > 0) {
                  
                  return res.render("login", { errors, username });
                }
                if(usertype==='Student'){
                try {
                  const user = await studentCollection.findOne({ username });
                  req.session.studentId = user._id;
                  // req.session.course = user.course
                  // req.session.semester = user.semester
              
                  // Check if the username exists
                  if (!user) {
                    errors.username = "Username not found.";
                    return res.render("login", { errors, username,password});
                  }
                  const hashedpassword = user.password
                  const matchedPassword = await bcrypt.compare(password,hashedpassword)
                  console.log(matchedPassword);
                  // Check if the password matches
                  if (!matchedPassword) {
                    errors.password = "Incorrect password.";
                    return res.render("login", { errors, username });
                  }
                  if (user.usertype !== usertype) {
                    errors.usertype = "Role not matched.";
                    return res.render("login", { errors, username,password });
                  }
                  const course = user.course
                  const semester = user.semester
                  const [notificatin,genaralnotification] = await getNotification({course,semester},res);
                  console.log(notificatin,genaralnotification);
                  // Store user info in session
                  req.session.username = user.username;
                  req.session.name = user.name;
                  req.session.usertype = user.usertype;
                  req.session.notification = notificatin
                  req.session.genaralnotification = genaralnotification
                  req.session.isStudent = true
                  req.session.isLogin=true
                  // Redirect to home page and pass the username
                
                    console.log(req.session)  
                    res.render('index',{ name: user.name,usermode:req.session});
                 
                               
                } 
                catch (error) {
                  console.error("Error during login:", error);
                  res.send("Error during login. Please try again.");
                }
              }
              else if(usertype==='Faculty'){
                try {
                  const user = await facultyCollection.findOne({ username });
                  req.session.facultyId = user._id;
                  console.log(req.session);
                  // Check if the username exists
                  if (!user) {
                    errors.username = "Username not found.";
                    return res.render("login", { errors, username,password });
                  }
                  const hashedpassword = user.password
                  const matchedPassword = await bcrypt.compare(password,hashedpassword)
                  console.log(matchedPassword);
                  // Check if the password matches
                  if (!matchedPassword) {
                    errors.password = "Incorrect password.";
                    return res.render("login", { errors, username });
                  }
                  if (user.usertype !== usertype) {
                    errors.usertype = "Role not matched.";
                    return res.render("login", { errors, username,password });
                  }
                  // Store user info in session
                  req.session.username = user.username;
                  req.session.name = user.name;
                  req.session.usertype = user.usertype;
                  req.session.isFaculty = true  
                  req.session.isLogin=true
                  console.log(req.session);       
                  // Redirect to home page and pass the username          
                   res.render('index',{ name: user.name,usermode:req.session});                                               
                } 
                catch (error) {
                  console.error("Error during login:", error);
                  res.send("Error during login. Please try again.");
                }
              }
              else if(usertype==='HOD'){
                try {
                  const user = await facultyCollection.findOne({ username });
              
                  // Check if the username exists
                  if (!user) {
                    errors.username = "Username not found.";
                    return res.render("login", { errors, username,password });
                  }
              
                  const hashedpassword = user.password
                  console.log(hashedpassword);
                  const matchedPassword = await bcrypt.compare(password,hashedpassword)
                  console.log(matchedPassword);
                  // Check if the password matches
                  if (!matchedPassword) {
                    errors.password = "Incorrect password.";
                    return res.render("login", { errors, username });
                  }

                  if (user.usertype !== usertype) {
                    errors.usertype = "Role not matched.";
                    return res.render("login", { errors, username,password });
                  }
                  // Store user info in session
                  req.session.username = user.username;
                  req.session.name = user.name;
                  req.session.usertype = user.usertype;  
                  req.session.isHOD = true  
                  req.session.isLogin=true  
                  console.log(req.session)   
                  // Redirect to home page and pass the username         
                   res.render('index',{ name: user.name,usermode:req.session});                                               
                } 
                catch (error) {
                  console.error("Error during login:", error);
                  res.send("Error during login. Please try again.");
                }
              }

            },
                       //DIRECTING TO HOME PAGE
                     
            studentHome: async (req, res) => {
              const name = req.session.name;
            // Retrieve the name from session
              if (!name) {
                  return res.redirect('/login'); // Redirect to login if session is not set
              }
              res.render('studentHome', { name,usermode:req.session}); // Pass the name to the view
          },

          facultyHome: async (req, res) => {
            const name = req.session.name;
         
            if (!name) {
                return res.redirect('/login'); // Redirect to login if session is not set
            }
            res.render('facultyHome', { name ,usermode:req.session}); // Pass the name to the view
        },
        hodHome: async (req, res) => {
          const name = req.session.name;
       
          if (!name) {
              return res.redirect('/login'); // Redirect to login if session is not set
          }
          res.render('hodHome', { name ,usermode:req.session}); // Pass the name to the view
      },
 
          studentProfile:async(req,res)=>{
            const name = req.session.name;
            try {
              // Find the user in the database by 'name'
              const user = await studentCollection.findOne({ name });
      
              // Check if the user exists in the database
              if (!user) {
                  return res.redirect('/login'); // If user not found, redirect to login
              }
      
              // Pass the entire user object to the profile view
              res.render('studentProfile', {
                  username: user.username,
                  name: user.name,
                  email: user.email,
                  phone: user.phone,
                  course:user.course,
                  semester:user.semester,
                  usermode:req.session
                  
                  // Add other user data you want to pass
              });
          } catch (error) {
              console.error("Error fetching user data:", error);
              res.send("Error fetching user data.");
          }
          },

          facultyProfile:async(req,res)=>{
            const name = req.session.name;
            try {
              // Find the user in the database by 'name'
              const user = await facultyCollection.findOne({ name });
      
              // Check if the user exists in the database
              if (!user) {
                  return res.redirect('/login'); // If user not found, redirect to login
              }
      
              // Pass the entire user object to the profile view
              res.render('facultyProfile', {
                  username: user.username,
                  name: user.name,
                  email: user.email,
                  phone: user.phone,
                  usertype:user.usertype,
                  usermode:req.session
                  
                  // Add other user data you want to pass
              });
          } catch (error) {
              console.error("Error fetching user data:", error);
              res.send("Error fetching user data.");
          }
          },

        viewStudTimetable:async(req,res)=>{
          const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
          console.log(req.session)
          const d = new Date();
          let day = days[d.getDay()];
          console.log(day)
          const studentId = req.session.studentId
          const studentData = await studentCollection.findOne({_id:studentId},{course:1,semester:1})
          const course = studentData.course
          const semester = studentData.semester
          const timetable =await currentDayTimeTable(course,semester,day);
          res.render('viewStudTimetable',{data:timetable[0],usermode:req.session});
          },
          showAllDayTimeTableForStudent:async(req,res)=>{
            const studentId = req.session.studentId
            const studentData = await studentCollection.findOne({_id:studentId},{course:1,semester:1})
            const course = studentData.course
            const semester = studentData.semester
            const timetable = await getAllTimetables(course,semester);
            res.render('showAllDayTimeTable',{data:timetable.timetable,usermode:req.session});
          },
          studentDetails:async(req,res)=>{
              const data = await studentCollection.find().lean();
              console.log(data)
              res.render('studentDetails',{data:data,usermode:req.session});
          },
          facultyDetails:async(req,res)=>{
              const data = await facultyCollection.find().lean();
              console.log(data);
              res.render('facultyDetails',{data,usermode:req.session})
          },
          viewFacTimetable:async(req,res)=>{
            const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
            const d = new Date();
            let day = days[d.getDay()];
            const facultyId = req.session.facultyId;
            const facultyName = await facultyCollection.findOne({_id:facultyId},{name:1});
            console.log(facultyName.name);
            const timetables = await getTimetablesForTutor(day, facultyName.name);
            console.log(timetables)
            res.render('viewFacTimetable',{data:timetables,day:day,tutor:facultyName.name,usermode:req.session});
          },
          saveTimeTable:async(req,res)=>{
            const errors = {};
           const { action } = req.body;
            try{
              if (action === "save") {
                   const course=req.session.course;
                   const semester=req.session.semester;
                   const data = req.body
                   const result = await addTimeTable({course,semester,data},res);
                   if(result){
                    res.render("addTimetable",{course,semester,usermode:req.session})
                   }else{
                    errors.day = "Day already exit.";
                    res.render("addTimetable",{errors,course,semester,usermode:req.session});
                   }
            }else{
              res.render('hodHome',{usermode:req.session});
            }
          }
          catch(err){
            console.log(err);
          }
          },
          getTimeTable:async(req,res)=>{
            const course=req.session.course;
            const semester=req.session.semester;
             res.render('addTimetable',{course,semester,usermode:req.session})
           
          },
          viewTimeTable:async(req,res)=>{
            //const data = req.body;  // Store the entire request body
            const { course } = req.body; 
           // const { usertype } = req.body; 
      
      if(course==='Mca'){
        res.render("hodHome");
      } // Destructure individual fields from `data`
           
              console.log(course);
              console.log("view Time table...");
          },
          //logut handling
          logout:async(req,res)=>{
            // For session-based authentication
            req.session.destroy((err) => {
            if (err) {
               console.error(err);
                 return res.redirect('/studentHome'); // Redirect to home even if an error occurs
            }
            res.clearCookie('connect.sid'); // Clear the session cookie
            return res.redirect('/login'); // Redirect to the login page
           });
          },


          //set
          
          addtimetable:async(req,res)=>{
            const  { course, semester } = req.body;
            console.log(req.body)
            req.session.course = course;
            req.session.semester = semester;
            console.log(req.session)
            const tutors = await facultyCollection.find({},{name:1}).lean();
            console.log(tutors);
           res.render('addTimetable',{course,semester,tutors,usermode:req.session}); 
          },


//set


          selectClass:async(req,res)=>{
            return res.render('classSelect',{usermode:req.session}); 
          },
          //set

          timetable:async(req,res)=>{
            res.render('timeTable',{usermode:req.session}); 
          },


          displayTimeTable:async(req,res)=>{
           const course=req.body.course;
           const semester=req.body.semester;
           req.session.course =course;
           req.session.semester = semester;
          //  console.log(req.session.course)
            const result = await getAllTimetablesForHOD(course,semester);
            res.render("timeTable",{data:result,course,semester,usermode:req.session});
          },
          editTimeTable:async(req,res)=>{
            const id = req.params.id;
            const course=req.session.course;
            const semester=req.session.semester;
            const result = await getTimeTableByeId({course,semester,id},res);
            const tutors = await facultyCollection.find({},{name:1}).lean();
            res.render("editTimeTable",{course,tutors,semester,data:result,usermode:req.session})
         },
         saveEditedTimetable:async(req,res)=>{
           const id = req.params.id
           const course = req.session.course
           const semester = req.session.semester
           const data = req.body
           console.log(data);
           const result = await editAndUpdatedTable({course,semester,id,data},res);
           const updatedData = await getAllTimetablesForHOD(course,semester);
           res.render("timeTable",{data:updatedData,course:req.session.course,semester:req.session.semester,usermode:req.session});
         },
         getAlldayTimeTable:async (req,res)=>{
            res.render("AllTimeTableForFaculty",{usermode:req.session})
         },
         postAlldayTimeTable:async (req,res)=>{
          const course = req.body.course
          const semester = req.body.semester
          console.log(course,semester)
          const timetables = await getAllTimetables(course,semester);
          console.log(timetables);
          res.render("AllTimeTableForFaculty",{data:timetables,usermode:req.session})
         },
         deleteStudent:async(req,res)=>{
          const id = req.params.id;
          await studentCollection.deleteOne({_id:id});
          res.redirect("/student-details");
          console.log(req.params);
         },
         deleteFaculty:async(req,res)=>{
          const id = req.params.id;
          await facultyCollection.deleteOne({_id:id});
          res.redirect("/faculty-details")
         },
         editStudentDetails:async(req,res)=>{
          const id = req.params.id;
          const result = await studentCollection.findOne({_id:id}).lean();
          console.log(result)
          res.render("editStudendDetails",{data:result,usermode:req.session})
         },
         saveEditedStudentDetails:async(req,res)=>{
          console.log(req.body)
          console.log(req.params)
          const id = req.params.id
          const result = await studentCollection.updateOne({_id:id},{$set:{
            name:req.body.name,
            email:req.body.email,
            phone:req.body.phone,
            course:req.body.course,
            semester:req.body.semester
          }})
          res.redirect("/student-details")
         },
         editFaculty:async(req,res)=>{
          const id = req.params.id
          const result = await facultyCollection.findOne({_id:id}).lean();
          res.render("editfacultyDetials",{data:result,usermode:req.session});
         },
         saveEditedFacultyDetails:async(req,res)=>{
          const id = req.params.id
          const result = await facultyCollection.updateOne({_id:id},{$set:{
             name:req.body.name,
             email:req.body.email,
             phone:req.body.phone
          }
          })
          console.log(result);
          res.redirect("/faculty-details")
         },
         sendInformations:async (req,res)=>{
          res.render("sendMail",{usermode:req.session})
         },
         sendinginformationMail:async (req,res)=>{
          const errors = {}
          const course = req.body.course
          const semester = req.body.semester
          const subject = req.body.emailSubject;
          const message = req.body.emailMessage;
          if(!course||!semester||!subject||!message){
            errors.msg = "Please enter all creadential"
            res.render("sendMail",{errors})
          }
          const emails = await getStudentEmail(course,semester);
          const result = await sendInfoEmail({course,semester,emails,subject,message},res);
          res.render("sendMail",{result,usermode:req.session}); 
         },
         sendinginformationMailToAll:async(req,res)=>{
          console.log(req.body);
          const subject = req.body.subject;
          const message = req.body.message;
          const emails = await getAllStudentEmail();
          console.log(emails);
          await sendInfoEmailToAll({subject,message,emails},res).then(()=>{
            res.json({
              status:"SUCCESS"
            });
          });
         }
}
