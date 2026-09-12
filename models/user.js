const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
    } // we only define the email here because the username and password will be handled by passport-local-mongoose
});

User.plugin(passportLocalMongoose); // this will add the username and password fields to the schema and also add some methods to the schema 

module.exports = mongoose.model("User", userSchema);