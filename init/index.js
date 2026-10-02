// const mongoose = require("mongoose");
// const initData = require("./data.js");
// const Listing = require("../models/listing.js");

// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

// main()
//   .then(() => {
//     console.log("connected to DB");
//   })
//   .catch((err) => {
//     console.log(err);
//   });

// async function main() {
//   await mongoose.connect(MONGO_URL);
// }

// const initDB = async () => {
//   await Listing.deleteMany({});
//   // this is to add the owner field to each object in the initData.data array with a specific user ID
//   initData.data = initData.data.map((obj) => ({...obj, owner: "6aa6149410b6f2657121be19"}));
//   await Listing.insertMany(initData.data);
//   console.log("data was initialized");
// };

// initDB(); 



require("dotenv").config();

console.log("MAP TOKEN EXISTS:", !!process.env.MAP_TOKEN);

const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");

// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const MONGO_URL = process.env.ATLASDB_URL;

const geocodingClient = mbxGeocoding({
    accessToken: process.env.MAP_TOKEN
});

main()
    .then(() => {
        console.log("connected to DB");
    })
    .catch((err) => {
        console.log(err);
    });

async function main() {
    await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
    // Delete old listings
    await Listing.deleteMany({});

    const listings = [];

    for (let obj of initData.data) {

        try {
            // Convert location into coordinates using Mapbox
            const response = await geocodingClient.forwardGeocode({
                query: obj.location,
                limit: 1,
            }).send();

            // If location was not found
            if (!response.body.features.length) {
                console.log(`Location not found: ${obj.location}`);
                continue;
            }

            // Add geometry to the listing
            const listing = {
                ...obj,
                owner: "6abde9a14b75ddf29de1a9f8",
                geometry: response.body.features[0].geometry
            };

            listings.push(listing);

            console.log(`Location found: ${obj.location}`);

        } catch (err) {
            console.log(`Error geocoding ${obj.location}:`, err.message);
        }
    }

    // Insert all listings into MongoDB
    await Listing.insertMany(listings);

    console.log("data was initialized");

    // Close database connection
    mongoose.connection.close();
};

initDB();