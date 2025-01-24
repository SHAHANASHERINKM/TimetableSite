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
