const mongoose = require('mongoose');
const initData = require('./data.js');
const Listing = require('../models/listing.js');

MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

async function main() {
  await mongoose.connect(MONGO_URL);
    }

main()
  .then (() => {
    console.log("Connected to MongoDB");
})
.catch((err) => {
    console.log(err);
});

const initDB = async () => {
    try {
        await Listing.deleteMany({});
        console.log("Cleared existing listings.");  
        await Listing.insertMany(initData.data);
        console.log("Database initialized with sample listings.");
    } catch (err) {
        console.error("Error initializing database: ", err);
    }
};

initDB().then(() => {
    mongoose.connection.close();
});
