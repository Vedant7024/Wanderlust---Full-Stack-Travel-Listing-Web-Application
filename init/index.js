const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

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
  await Listing.deleteMany({});
  // this is to add the owner field to each object in the initData.data array with a specific user ID
  initData.data = initData.data.map((obj) => ({...obj, owner: "6aa6149410b6f2657121be19"}));
  await Listing.insertMany(initData.data);
  console.log("data was initialized");
};

initDB(); 