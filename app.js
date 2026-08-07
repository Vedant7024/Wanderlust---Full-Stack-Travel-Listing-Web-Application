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


const validationMiddleware = (req,res,next) => {
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errmsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(errmsg, 400)
    } else {
        next();
    }
};

app.get("/", (req,res) => {
    res.send("working");
});


//New Route

app.get("/listings/new", (req,res) => {
    res.render("listing/new.ejs");
});

// Create Route

app.post("/listings", validationMiddleware, wrapAsync(async (req,res,next) => {
        const newListing = new Listing(req.body.listing);
         await newListing.save();
        res.redirect("/listings");
}));


// index route
app.get("/listings", wrapAsync(async (req,res,next) => {
    let allListing = await Listing.find({});
    res.render("listing/index.ejs", {allListing});
}));


// show route
app.get("/listings/:id",wrapAsync(async (req,res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listing/show.ejs", {listing});
}));

//Edit Route
app.get("/listings/:id/edit", wrapAsync(async (req,res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listing/edit.ejs" , {listing});
})); 


//Update Route

app.put("/listings/:id" , validationMiddleware, wrapAsync(async(req,res) => {
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing}); 
    res.redirect(`/listings/${id}`);
}));

// DELETE Route

app.delete("/listings/:id", wrapAsync(async (req,res) => {
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
}));


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

