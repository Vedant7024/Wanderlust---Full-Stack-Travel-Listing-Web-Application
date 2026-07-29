const mongoose = require("mongoose");
const schema = mongoose.Schema;
 

const listingSchema = schema({
    title: {
        type: String,
        required: true, 
    },
    description: String,
    image: {
        filename: {
            type: String,
            default: "listingimage",
        },
        url: {
            type: String,
            default:
                "https://media.istockphoto.com/id/1087673356/photo/highway-at-sunrise-going-into-death-valley-national-park.jpg?s=1024x1024&w=is&k=20&c=djFLS8h7JpVqpY4MLtnHInoKygtftaUcwR03prsKuss=",
        },
    },
    price: Number,
    location: String,
    country: String
});

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing; 