const express = require("express");
const router = express.Router({ mergeParams: true });
// const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { validatReview, isLoggedIn, isReviewAuthor } = require("../middileware.js");
const reviewController = require("../controllers/reviews.js");


//POST route
router.post("/", isLoggedIn, validatReview, wrapAsync(reviewController.createReview));

//DELETE ROUTE

router.delete("/:reviewId",isLoggedIn, isReviewAuthor, wrapAsync(reviewController.deleteReview));


module.exports = router;