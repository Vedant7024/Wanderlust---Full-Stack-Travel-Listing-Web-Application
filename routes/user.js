const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const {saveRedirectUrl} = require("../middileware.js");
const usersController = require("../controllers/users.js");



router.route("/signup")
.get(usersController.renderSignup)
.post(wrapAsync(usersController.createUser));

router.route("/login")
.get(usersController.renderLogin)
.post(saveRedirectUrl,passport.authenticate("local", {failureRedirect: "/login", failureFlash: true}), usersController.loginUser); 


router.get("/logout", usersController.logoutUser);

module.exports = router;