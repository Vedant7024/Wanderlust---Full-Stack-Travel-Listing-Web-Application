const Listing = require("./models/listing");
const Review = require("./models/review.js");  
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema } = require("./schema.js");
const { reviewsSchema } = require("./schema.js");


// this middleware is used to check if the user is logged in
module.exports.isLoggedIn = (req,res,next) => {
     if(! req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be logged in to create a new listing");
        return res.redirect("/login");
    }
    next();
}


// this middleware is used to save the redirect url in locals so that it can be accessed in the views
module.exports.saveRedirectUrl = (req,res,next) => {
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }   
    next();
};

// this middleware is used to check if the user is the owner of the listing
// module.exports.isOwner = async (req,res,next) => {
//      let {id} = req.params;
//         let listing = await Listing.findById(id);
//         if(!listing || !listing.owner.equals(req.user._id)){
//             req.flash("error", "You are no the onwer of this listing");
//             return res.redirect(`/listings/${id}`);
//         }
//         next();
// };

module.exports.isOwner = async (req, res, next) => {
    const { id } = req.params;

    const listing = await Listing.findById(id);

    if (!listing || !listing.owner || !listing.owner.equals(req.user._id)) {
        req.flash("error", "You are not the owner of this listing");
        return res.redirect(`/listings/${id}`);
    }

    next();
};

// this middleware is used to validate the listing data using the Joi schema
module.exports.validationMiddleware = (req,res,next) => {
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errmsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(errmsg, 400)
    } else {
        next();
    }
};


// SERVERSIDE VALIDATION FOR THE REVIEWS
module.exports.validatReview = (req,res,next) => {
    let {error} = reviewsSchema.validate(req.body);
    if(error){
        let errmsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(errmsg, 400)
    } else {
        next();
    }
};


// this middleware is used to check if the user is the owner of the listing
module.exports.isReviewAuthor = async (req,res,next) => {
     let {reviewId, id} = req.params;
        let review = await Review.findById(reviewId);
        if(!review || !review.author.equals(req.user._id)){
            req.flash("error", "You are not the author of this review");
            return res.redirect(`/listings/${id}`);
        }
        next();
};