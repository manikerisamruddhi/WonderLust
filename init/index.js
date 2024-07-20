const mongoose = require('mongoose');
const Listing = require('../models/listing.js');
const initdata = require('./data.js');

const url = 'mongodb://127.0.0.1:27017/wonderlust';

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("Connected to DB");
        initDB();
    })
    .catch((err) => {
        console.log(`Error occurred in main function: ${err}`);
    });

const initDB = async () => {
    try {
        await Listing.deleteMany({});
        await Listing.insertMany(initdata.data);
        // console.log("Data initialized");
        console.log(Listing);
    } catch (error) {
        console.log(`Error initializing data: ${error}`);
    }
};
