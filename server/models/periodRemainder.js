const mongoose = require('mongoose');
const studentSchema = new mongoose.Schema({
    name: String,
    phone: String, // E.164 format (e.g., +1234567890)
    schedule: [
      {
        subject: String,
        startingTime: String, // Format: "HH:mm" (e.g., "08:30")
      },
    ],
  });


const Student = mongoose.model('Student', studentSchema);
module.exports = Student