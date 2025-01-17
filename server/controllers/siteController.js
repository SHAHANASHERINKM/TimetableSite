require('../models/database');
const studentCollection = require('../models/studentUser');
const facultyCollection = require('../models/facultyUser');
// Import collections
const { mcaS1collection, mscS1collection, mcaS2collection, mscS2collection } = require('../models/timetable');
const { default: mongoose } = require('mongoose');

// Dynamic collection mapping
const collectionMapping = {
    "MCA-S1": mcaS1collection,
    "MSC-S1": mscS1collection,
    "MCA-S2": mcaS2collection,
    "MSC-S2": mscS2collection
};
module.exports = {
    login: async(req,res)=>{
        res.render("login", { errors: {}, username: "" });
    },
    role:async(req,res)=>{
        res.render('role')
    },

    signup: async(req,res)=>{
      const { usertype } = req.body; 
      
      if(usertype==='Student'){
        res.render("studentSignup");
      }
      else if(usertype==='Faculty'){
        res.render("facultySignup");
      }
      else{
        res.render("facultySignup");
      }
      
      

        //res.render("signup");
    },

    studentSignup_validation: async(req,res)=>{
        const data = req.body;  // Store the entire request body
        const { name, email, phone, username, password, usertype,course, semester } = data;  // Destructure individual fields from `data`
        const errors = {};
        

        // Validate input fields
        if (!name) {
            errors.name = "*Name is required.";
        }
        if (!email) {
            errors.email = "*Email is required.";
        }
        if (!phone) {
            errors.phone = "*Phone number is required.";
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

            // Insert data into the database
            await studentCollection.insertMany([data]);

            // Redirect to welcome page
            res.render("welcomeSignup", { name: data.name });
        } catch (error) {
          
            console.error("Error during signup:", error);
            res.send("Error during signup. Please try again.");
        }
            },

            facultySignup_validation: async(req,res)=>{
              const data = req.body;  // Store the entire request body
              const { name, email, phone, username, password, usertype } = data;  // Destructure individual fields from `data`
              const errors = {};
              
      
              // Validate input fields
              if (!name) {
                  errors.name = "*Name is required.";
              }
              if (!email) {
                  errors.email = "*Email is required.";
              }
              if (!phone) {
                  errors.phone = "*Phone number is required.";
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
      
                  // Insert data into the database
                  await facultyCollection.insertMany([data]);
      
                  // Redirect to welcome page
                  res.render("welcomeSignup", { name: data.name });
              } catch (error) {
                  console.error("Error during signup:", error);
                  res.send("Error during signup. Please try again.");
              }
                  },






      login_validation: async(req,res)=>{
                const { username, password, yeartype,usertype } = req.body;
                const errors = {};
              
                // Validate input fields
                if (!username) {
                  errors.username = "*Username is required.";
                }
                if (!password) {
                  errors.password = "*Password is required.";
                }
                if (!yeartype) {
                  errors.yeartype = "*yeartype is required.";
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
              
                  // Check if the username exists
                  if (!user) {
                    errors.username = "Username not found.";
                    return res.render("login", { errors, username,password });
                  }
              
                  // Check if the password matches
                  if (user.password !== password) {
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

                  
                  // Redirect to home page and pass the username
              
                  
                    res.render('studentHome',{ name: user.name });
                 
                               
                } 
                catch (error) {
                  console.error("Error during login:", error);
                  res.send("Error during login. Please try again.");
                }
              }
              else if(usertype==='Faculty'){
                try {
                  const user = await facultyCollection.findOne({ username });
              
                  // Check if the username exists
                  if (!user) {
                    errors.username = "Username not found.";
                    return res.render("login", { errors, username,password });
                  }
              
                  // Check if the password matches
                  if (user.password !== password) {
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
                  // Redirect to home page and pass the username          
                  
                   res.render('facultyHome',{ name: user.name });                                               
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
              
                  // Check if the password matches
                  if (user.password !== password) {
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
                  // Redirect to home page and pass the username          
                  
                   res.render('hodHome',{ name: user.name });                                               
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
              res.render('studentHome', { name }); // Pass the name to the view
          },

          facultyHome: async (req, res) => {
            const name = req.session.name;
         
            if (!name) {
                return res.redirect('/login'); // Redirect to login if session is not set
            }
            res.render('facultyHome', { name }); // Pass the name to the view
        },
        hodHome: async (req, res) => {
          const name = req.session.name;
       
          if (!name) {
              return res.redirect('/login'); // Redirect to login if session is not set
          }
          res.render('hodHome', { name }); // Pass the name to the view
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
                  
                  // Add other user data you want to pass
              });
          } catch (error) {
              console.error("Error fetching user data:", error);
              res.send("Error fetching user data.");
          }
          },

        viewStudTimetable:async(req,res)=>{
          
            res.render('viewStudTimetable');
         
          },
          viewFacTimetable:async(req,res)=>{
          
            res.render('viewStudTimetable');
         
          },
          saveTimeTable:async(req,res)=>{
            const errors = {};
           const { action } = req.body;
           // console.log(action);
            try{
              if (action === "save") {


           // const { course, semester, timetable } = req.body;       
               const data = {
               day:req.body.day,
               'firstPeriod.0.subject':req.body.subject1,
               'firstPeriod.0.startingTime':req.body.startTime1,
               'firstPeriod.0.endingTime':req.body.endTime1,
               'firstPeriod.0.tutor':req.body.tutor1,
               'secondPeriod.0.subject':req.body.subject2,
               'secondPeriod.0.startingTime':req.body.startTime2,
               'secondPeriod.0.endingTime':req.body.endTime2,
               'secondPeriod.0.tutor':req.body.tutor2,
               'thirdPeriod.0.subject':req.body.subject3,
               'thirdPeriod.0.startingTime':req.body.startTime3,
               'thirdPeriod.0.endingTime':req.body.endTime3,
               'thirdPeriod.0.tutor':req.body.tutor3,
               'fourthPeriod.0.subject':req.body.subject4,
               'fourthPeriod.0.startingTime':req.body.startTime4,
               'fourthPeriod.0.endingTime':req.body.endTime4,
               'fourthPeriod.0.tutor':req.body.tutor4,
               'fifthPeriod.0.subject':req.body.subject5,
               'fifthPeriod.0.startingTime':req.body.startTime5,
               'fifthPeriod.0.endingTime':req.body.endTime5,
               'fifthPeriod.0.tutor':req.body.tutor5
            }
            //console.log(data);
            const course=req.session.course;
            const semester=req.session.semester;
            console.log(course);
            console.log(semester);
            if (course=="MCA"&& semester == "S1"){
              const day=data.day;
              const existingDay = await mcaS1collection.findOne({ day});
              if (existingDay) {
                errors.day = "Day already exit.";
                res.render("addTimetable",{errors,course,semester})
              }
              await mcaS1collection.insertMany([data]);

            }else if(course=='MCA'&&semester == "S2"){
              
              await mcaS2collection.insertMany([data]);
            }else if(course == "MSC" && semester == "S1"){
              
              await mscS1collection.insertMany([data]);
            }else{
             
              await mscS2collection.insertMany([data]);
            }
             res.render("addTimetable",{course,semester})

          }
          else{
            res.render('hodHome')
          }
          }
          
          catch(err){
            console.log(err);
          }
          },


          
          getTimeTable:async(req,res)=>{
            const course=req.session.course;
            const semester=req.session.semester;
             res.render('addTimetable',{course,semester})
           
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
           
           res.render('addTimetable',{course,semester}); 
          },


//set


          selectClass:async(req,res)=>{
            return res.render('classSelect'); 
          },
          //set

          timetable:async(req,res)=>{
            res.render('timeTable'); 
          },


          displayTimeTable:async(req,res)=>{

           console.log(req.body);
           const course=req.body.course;
           const semester=req.body.semester;
           req.session.course =course;
           req.session.semester = semester;
          //  console.log(req.session.course)

           if (course=="MCA" && semester=="S1"){
            const s1data=  await mcaS1collection.find();
            console.log(s1data);
            res.render("timeTable",{data:s1data,course,semester});
           }
          },

          editTimeTable:async(req,res)=>{
            console.log(req.params);
            const course=req.session.course;
            const semester=req.session.semester;
            console.log(course);
            if (course=="MCA"&& semester == "S1"){
              const timetable= await mcaS1collection.findOne({_id:req.params.id});
              console.log(timetable);
              res.render("editTimeTable",{course,semester,data:timetable})
            }
         },
         saveEditedTimetable:async(req,res)=>{
           const id = req.params.id
           console.log(id)
           const updatedData = await mcaS1collection.findByIdAndUpdate({_id:id},{
            day:req.body.day,
            'firstPeriod.0.subject':req.body.subject1,
            'firstPeriod.0.startingTime':req.body.startTime1,
            'firstPeriod.0.endingTime':req.body.endTime1,
            'firstPeriod.0.tutor':req.body.tutor1,
            'secondPeriod.0.subject':req.body.subject2,
            'secondPeriod.0.startingTime':req.body.startTime2,
            'secondPeriod.0.endingTime':req.body.endTime2,
            'secondPeriod.0.tutor':req.body.tutor2,
            'thirdPeriod.0.subject':req.body.subject3,
            'thirdPeriod.0.startingTime':req.body.startTime3,
            'thirdPeriod.0.endingTime':req.body.endTime3,
            'thirdPeriod.0.tutor':req.body.tutor3,
            'fourthPeriod.0.subject':req.body.subject4,
            'fourthPeriod.0.startingTime':req.body.startTime4,
            'fourthPeriod.0.endingTime':req.body.endTime4,
            'fourthPeriod.0.tutor':req.body.tutor4,
            'fifthPeriod.0.subject':req.body.subject5,
            'fifthPeriod.0.startingTime':req.body.startTime5,
            'fifthPeriod.0.endingTime':req.body.endTime5,
            'fifthPeriod.0.tutor':req.body.tutor5
           },{new:true,runValidators:true});
           const data = await mcaS1collection.find({_id:id});
           res.render("timeTable",{data:data,course:req.session.course,semester:req.session.semester});
         }
}