const mongoose =require('mongoose');

const timetableSchema = new mongoose.Schema({

    day:{
        type:String,
        required:true
    },
    firstPeriod:[{
        subject:{
            type:String,
        },
        startingTime:{
            type:String,
            set: (value) => (value === '' ? '09:30' : value)
        },
        endingTime:{
            type:String,
            set: (value) => (value === '' ? '10:30' : value)
        },
        tutor:{
            type:String,
        }
    }
    ],
    secondPeriod:[{
        subject:{
            type:String,
        },
        startingTime:{
            type:String,
            set: (value) => (value === '' ? '10:30' : value)
        },
        endingTime:{
            type:String,
            set: (value) => (value === '' ? '11:30' : value)
        },
        tutor:{
            type:String,
        }
    }
    ],
    thirdPeriod:[{
        subject:{
            type:String,
        },
        startingTime:{
            type:String,
            set: (value) => (value === '' ? '11:30' : value)
        },
        endingTime:{
            type:String,
            set: (value) => (value === '' ? '12:30' : value)
        },
        tutor:{
            type:String,
        }
    }
    ],
    fourthPeriod:[{
        subject:{
            type:String,
        },
        startingTime:{
            type:String,
            set: (value) => (value === '' ? '01:30' : value)
        },
        endingTime:{
            type:String,
            set: (value) => (value === '' ? '02:30' : value)
        },
        tutor:{
            type:String,
        }
    }
    ],
    fifthPeriod:[{
        subject:{
            type:String,
        },
        startingTime:{
            type:String,
            set: (value) => (value === '' ? '02:30' : value)
        },
        endingTime:{
            type:String,
            set: (value) => (value === '' ? '03:30' : value)
        },
        tutor:{
            type:String,
        }
    }
    ]
})
const mcaS1collection = mongoose.model("mcaS1collection", timetableSchema);
const mcaS2collection = mongoose.model("mcaS2collection", timetableSchema);
const mcaS3collection = mongoose.model("mcaS3collection", timetableSchema);
const mcaS4collection = mongoose.model("mcaS4collection", timetableSchema);
const mscS1collection = mongoose.model("mscS1collection", timetableSchema);
const mscS2collection = mongoose.model("mscS2collection", timetableSchema);
const mscS3collection = mongoose.model("mscS3collection", timetableSchema);
const mscS4collection = mongoose.model("mscS4collection", timetableSchema);


module.exports = {
    mcaS1collection,
    mcaS2collection,
    mcaS3collection,
    mcaS4collection,
    mscS1collection,
    mscS2collection,
    mscS3collection,
    mscS4collection
};