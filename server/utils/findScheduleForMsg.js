const studentCollection = require("../models/studentUser"); // Replace with the correct path to your student schema
const Student = require("../models/periodRemainder");
const cron = require("node-cron");
const {
  mcaS1collection,
  mcaS2collection,
  mcaS3collection,
  mcaS4collection,
  mscS1collection,
  mscS2collection,
  mscS3collection,
  mscS4collection,
} = require("../models/timetable"); // Replace with the correct path to your timetable schema

// Map course and semester to the corresponding timetable collection
const timetableCollections = {
  'MCA-S1': mcaS1collection,
  'MCA-S2': mcaS2collection,
  'MCA-S3': mcaS3collection,
  'MCA-S4': mcaS4collection,
  'MSC-S1': mscS1collection,
  'MSC-S2': mscS2collection,
  'MSC-S3': mscS3collection,
  'MSC-S4': mscS4collection,
};

// Connect to MongoDB
// mongoose.connect('mongodb://localhost:27017/school', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// Function to get the timetable for each student

    async function getStudentSchedule(day){
        try {
            // Fetch all students
            const students = await studentCollection.find();
            const results = [];
        
            for (const student of students) {
              const { name, phone, course, semester } = student;
        
              // Determine the correct timetable collection based on course and semester
              const collectionKey = `${course.toUpperCase()}-${semester.toUpperCase()}`;
              const timetableCollection = timetableCollections[collectionKey];
              if (!timetableCollection) {
                console.error(`No timetable found for course ${course} and semester ${semester}`);
                continue;
              }
        
              // Fetch the timetable for the given day
              const timetable = await timetableCollection.findOne({ day });
              if (!timetable) {
                console.log(`No timetable found for ${day} for course ${course} semester ${semester}`);
                continue;
              }
        
              // Extract schedule data
              const schedule = [];
              const periods = ['firstPeriod', 'secondPeriod', 'thirdPeriod', 'fourthPeriod', 'fifthPeriod'];
        
              for (const period of periods) {
                if (timetable[period] && timetable[period].length > 0) {
                  const { subject, startingTime } = timetable[period][0];
                  if (subject && startingTime) {
                    schedule.push({ subject, startingTime });
                  }
                }
              }
        
              // Append student data with their schedule to the results
              results.push({ name, phone, schedule });
            }
        
            // Print the results
            console.log('Student Schedules:');
            JSON.stringify(results, null, 2);
            return results;
          } catch (err) {
            console.error('Error fetching data:', err);
          }
    }


//Specify the day and call the function
// const day = 'Monday'; // Replace with the day you want (e.g., 'Monday', 'Tuesday', etc.)
const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const d = new Date();
let day = days[d.getDay()];

async function executeStudentScheduleUpdate() {
  try {
      await Student.deleteMany({});
      const results = await getStudentSchedule(day);
      const data = await Student.insertMany(results);
      console.log('Student schedule updated successfully:', data);
  } catch (error) {
      console.error('Error updating student schedule:', error);
  }
}

cron.schedule('0 0 * * *', async () => {
  console.log('Function executed at 12:00 AM!');
  await executeStudentScheduleUpdate();
});

cron.schedule('0 2 * * *', async () => {
  console.log('Function executed at 2:00 AM!');
  await executeStudentScheduleUpdate();
});

cron.schedule('0 4 * * *', async () => {
  console.log('Function executed at 4:00 AM!');
  await executeStudentScheduleUpdate();
});

