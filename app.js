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
const listingRouter = require("./routes/listings.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");


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


const sessionOptions = {
    secret: "mtsupersecretcode",
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    },
};


app.use(session(sessionOptions));
app.use(flash());


app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());       


app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});



// this is onlt for testing purpose to create a new user in the database. You can remove this code after testing.

// app.get("/demouser", async (req, res) => {
//     let fakeuser = new User({
//         email: "Vedant192005@gmail.com",
//         username: "Vedant",
//     })

//     let registeredUser = await User.register(fakeuser, "Vedant@192005");
//     res.send(registeredUser);
// });

app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);


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