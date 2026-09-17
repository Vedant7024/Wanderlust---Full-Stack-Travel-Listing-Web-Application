const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner, validationMiddleware } = require("../middileware.js");
const listingController = require("../controllers/listings.js");



//Router.route() is used to create chainable route handlers for a route path. It is a way to modularize the routes and make the code more organized. In this case, it is used to define the routes for the listings resource.

router.route("/")
// index route
.get(wrapAsync(listingController.index))
// Create Route
.post(isLoggedIn, validationMiddleware, wrapAsync(listingController.renderCreateForm));

//New Route
router.get("/new", isLoggedIn, listingController.renderNewForm); 


router.route("/:id")
//Show route
.get(wrapAsync(listingController.renderShowPage))
//Update Route
.put( isLoggedIn, isOwner,  validationMiddleware, wrapAsync(listingController.renderUpdateForm))
//DELETE Route
.delete(isLoggedIn, isOwner, wrapAsync(listingController.renderDeleteForm));


//Edit Route
router.get("/:id/edit", isLoggedIn, isOwner,  wrapAsync(listingController.renderEditForm)); 

module.exports = router;
