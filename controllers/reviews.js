const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const express = require("express");
const router = express.Router({ mergeParams: true });


module.exports.createReview = async (req, res) => {
    let listings = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;    
    listings.reviews.push(newReview);
    await newReview.save();
    await listings.save(); 
    req.flash("success", "New Review Created");
    console.log("New Review Saved");
    res.redirect(`/listings/${listings._id}`);
};

module.exports.deleteReview = async (req, res) => {
    let {id, reviewId} = req.params;

    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review Deleted");

    res.redirect(`/listings/${id}`);
};