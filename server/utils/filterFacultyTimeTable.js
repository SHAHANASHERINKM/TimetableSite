const { mcaS1collection, mcaS2collection, mcaS3collection, mcaS4collection, mscS1collection, mscS2collection, mscS3collection, mscS4collection } = require('../models/timetable');

const collections = [
  { name: 'MCA S1', collection: mcaS1collection },
  { name: 'MCA S2', collection: mcaS2collection },
  { name: 'MCA S3', collection: mcaS3collection },
  { name: 'MCA S4', collection: mcaS4collection },
  { name: 'MSC S1', collection: mscS1collection },
  { name: 'MSC S2', collection: mscS2collection },
  { name: 'MSC S3', collection: mscS3collection },
  { name: 'MSC S4', collection: mscS4collection },
];

const collectionsforFetchingAllTimeTable = {
  "MCA S1": mcaS1collection,
  "MCA S2": mcaS2collection,
  "MCA S3": mcaS3collection,
  "MCA S4": mcaS4collection,
  "MSC S1": mscS1collection,
  "MSC S2": mscS2collection,
  "MSC S3": mscS3collection,
  "MSC S4": mscS4collection,
};

module.exports={
  getTimetablesForTutor: async (day, tutorName) => {
    const results = [];

    // Loop through each course collection
    for (const { name: courseName, collection } of collections) {
      // Fetch timetable for the specific day
      const timetable = await collection.findOne({ day });

      if (timetable) {
        // Convert Mongoose document to plain JS object
        const timetableObj = timetable.toObject();

        let hasValidPeriods = false; // Flag to track if any periods are valid

        // Add `course` field and filter periods by tutor
        Object.keys(timetableObj).forEach((key) => {
          if (Array.isArray(timetableObj[key])) {
            // Filter periods for this tutor and add the course field
            const filteredPeriods = timetableObj[key]
              .filter((period) => period.tutor === tutorName) // Filter periods by tutor
              .map((period) => ({
                ...period,
                course: courseName, // Add course field dynamically
              }));

            // If periods are found for this tutor, update the timetable
            if (filteredPeriods.length > 0) {
              timetableObj[key] = filteredPeriods;
              hasValidPeriods = true;
            } else {
              delete timetableObj[key]; // Remove empty periods
            }
          }
        });

        // Only add the timetable to the results if there are valid periods for the tutor
        if (hasValidPeriods) {
          results.push({
            course: courseName, // Include course name in the result
            day: timetableObj.day,
            periods: timetableObj, // Include periods (filtered and modified)
          });
        }
      }
    }

    return results; // Return the filtered results
  },
  getAllTimetables :async (course,semester)=>{
    try {
      const collectionName = `${course} ${semester}`;
      const collection = collectionsforFetchingAllTimeTable[collectionName];
  
      if (!collection) {
        console.error("Invalid course or semester");
        return;
      }
  
      // Fetch timetable for the specific course and semester
      const timetable = await collection.find().lean(); // Fetch all documents from the collection
      console.log(timetable)
      return {
        course: `${course} ${semester}`,
        timetable,
      };
    } catch (error) {
      console.error("Error fetching timetable:", error);
    }
  }
}
