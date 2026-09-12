const express = require("express");
const router = express.Router({ mergeParams: true });
// const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { listingSchema } = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const { reviewsSchema } = require("../schema.js");





// SERVERSIDE VALIDATION FOR THE REVIEWS
const validatReview = (req,res,next) => {
    let {error} = reviewsSchema.validate(req.body);
    if(error){
        let errmsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(errmsg, 400)
    } else {
        next();
    }
};

//POST route
router.post("/", validatReview, wrapAsync(async (req, res) => {
    let listings = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    listings.reviews.push(newReview);
    await newReview.save();
    await listings.save(); 
    req.flash("success", "New Review Created");
    console.log("New Review Saved");
    res.redirect(`/listings/${listings._id}`);
}));

//DELETE ROUTE

router.delete("/:reviewId", wrapAsync( async (req, res) => {
    let {id, reviewId} = req.params;

    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review Deleted");

    res.redirect(`/listings/${id}`);
}));


module.exports = router;