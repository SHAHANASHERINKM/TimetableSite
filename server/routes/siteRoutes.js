const express = require('express');
const router = express.Router();
const siteControllers = require('../controllers/siteController');

router.get('/', siteControllers.Home);
router.get('/role', siteControllers.role);
router.get('/signup', siteControllers.signup);
router.get('/login', siteControllers.login);
router.get('/studentHome', siteControllers.studentHome);
router.get('/facultyHome', siteControllers.facultyHome);
router.get('/hodHome', siteControllers.hodHome);
router.get('/studentprofile', siteControllers.studentProfile);
router.get('/facultyProfile', siteControllers.facultyProfile);
router.get('/viewStudTimetable', siteControllers.viewStudTimetable);
router.get('/viewFacTimetable', siteControllers.viewFacTimetable);
router.get('/logout', siteControllers.logout);
router.get('/timeTable', siteControllers.timetable);
router.get('/selectClass', siteControllers.selectClass);
router.get('/show-all-day-timetable-student',siteControllers.showAllDayTimeTableForStudent)
router.get('/addTimeTable', siteControllers.getTimeTable);
router.get('/edit-timetable/:id', siteControllers.editTimeTable);
router.get('/student-details',siteControllers.studentDetails);
router.get('/faculty-details',siteControllers.facultyDetails)
router.get("/all-timetables-for-faculty",siteControllers.getAlldayTimeTable)
router.get("/delete-student/:id",siteControllers.deleteStudent)
router.get("/delete-faculty/:id",siteControllers.deleteFaculty)
router.get('/edit-student-details/:id',siteControllers.editStudentDetails)
router.get("/edit-faculty/:id",siteControllers.editFaculty)
router.get("/send-informations",siteControllers.sendInformations)


//router.get('/edit-timetable',siteControllers.editTimeTable)


router.post('/login', siteControllers.login_validation);
router.post('/role', siteControllers.signup);
router.post('/studentsignup', siteControllers.studentSignup_validation);
router.post('/facultysignup', siteControllers.facultySignup_validation);
router.post('/save-timetable',siteControllers.saveTimeTable);
router.post('/displayTimeTable',siteControllers.displayTimeTable);
router.post('/addTimeTable', siteControllers.addtimetable);
router.post('/saveeditedtimetable/:id',siteControllers.saveEditedTimetable)
router.post("/show-all-time-table-for-faculty",siteControllers.postAlldayTimeTable)
router.post("/edit-student-details/:id",siteControllers.saveEditedStudentDetails)
router.post("/edit-faculty-details/:id",siteControllers.saveEditedFacultyDetails)
router.post("/send-informations",siteControllers.sendinginformationMail)
router.post("/send-mail-to-all",siteControllers.sendinginformationMailToAll)
//router.get('/view-time-table',siteControllers.viewTimeTable)
//router.post('/submitClassSelected',siteControllers.submitClassSelected)



  

  module.exports = router;