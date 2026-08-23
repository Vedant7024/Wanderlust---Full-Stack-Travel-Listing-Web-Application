const express = require("express");
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const app = express();
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema } = require("./schema.js");
const Review = require("./models/review.js");
const { reviewsSchema } = require("./schema.js");
const listings = require("./routes/listings.js");
const review = require("./routes/review.js");


app.set("views", path.join(__dirname, "views"));   
app.set("view engine", "ejs");
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));
app.engine('ejs', ejsMate);


const URL = "mongodb://127.0.0.1:27017/wanderlust";

async function main() {
    await mongoose.connect(URL);
};


main().then((res) => {
    console.log("Connectes to DB");
}) .catch((err) => {
    console.log(err);
});




app.use("/listings", listings);
app.use("/listings/:id/reviews", review);

// app.get("/testlisting",async (req,res) => {
//     let samplelisting = new Listing({
//         title: "My new villa",
//         descripton: "By the beach",
//         price: 1200,
//         location: "Sarangarh",
//         country: "India"
//     });

//     await samplelisting.save()
//     console.log("sample was saved");
//     res.send("Sucess full testing");
// });


// Error Handling for all other routes which are not defined in the app.js file

app.all("/*splat",(req,res,next) => {
    next(new ExpressError("Page Not Found", 404));
});


app.use((err,req,res,next) => {
    let{ statusCode = 500, message = "Something went wrong"} = err;
    // res.status(statusCode).send(message);
    res.status(statusCode).render("listing/error.ejs", {err});
});

app.listen("3000", () => { 
    console.log("Server is running on the port : 3000");
}); 