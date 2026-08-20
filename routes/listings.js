const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { listingSchema } = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");



const validationMiddleware = (req,res,next) => {
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errmsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(errmsg, 400)
    } else {
        next();
    }
};

//New Route

router.get("/new", (req,res) => {
    res.render("listing/new.ejs");
});

// Create Route

router.post("/", validationMiddleware, wrapAsync(async (req,res,next) => {
        const newListing = new Listing(req.body.listing);
         await newListing.save();
        res.redirect("/listings");
}));


// index route
router.get("/listings", wrapAsync(async (req,res,next) => {
    let allListing = await Listing.find({});
    res.render("listing/index.ejs", {allListing});
}));


// show route
router.get("/:id",wrapAsync(async (req,res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    res.render("listing/show.ejs", {listing});
}));

//Edit Route
router.get("/:id/edit", wrapAsync(async (req,res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listing/edit.ejs" , {listing});
})); 


//Update Route

router.put("/:id" , validationMiddleware, wrapAsync(async(req,res) => {
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing}); 
    res.redirect(`/listings/${id}`);
}));

// DELETE Route

router.delete("/:id", wrapAsync(async (req,res) => {
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
}));

module.exports = router;
