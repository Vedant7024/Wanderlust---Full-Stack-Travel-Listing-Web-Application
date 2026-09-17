const Listing = require("../models/listing.js");

module.exports.index = async (req,res,next) => {
    let allListing = await Listing.find({});
    res.render("listing/index.ejs", {allListing});
};

module.exports.renderNewForm = (req,res) => {
    res.render("listing/new.ejs");
};

module.exports.renderCreateForm = async (req,res,next) => {
        const newListing = new Listing(req.body.listing);
        newListing.owner = req.user._id; // set the owner field to the current user's ID
        await newListing.save();
         req.flash("success", "New Listings Created");
        res.redirect("/listings");
};

module.exports.renderShowPage = async (req,res) => {
    let {id} = req.params;
    // populate the reviews and owner fields of the listing document
    const listing = await Listing.findById(id).populate({path: "reviews", populate: {path: "author"}}).populate("owner");
    if(!listing){
        req.flash("error", "Listing not found");
        return res.redirect("/listings");
    }
    res.render("listing/show.ejs", {listing});
};

module.exports.renderEditForm = async (req,res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error", "Listing you want to edit does not exist");
        return res.redirect("/listings");
    }
    res.render("listing/edit.ejs" , {listing});
};

module.exports.renderUpdateForm = async(req,res) => {
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing}); 
    req.flash("success", "Listing Updated");
    res.redirect(`/listings/${id}`);
};

module.exports.renderDeleteForm = async (req,res) => {
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted ");
    res.redirect("/listings");
};