const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const TripSchema = new Schema({
    title: String,
    price: String,
    description: String,
    location: String
});

const Trip2Schema = new Schema({
    place: String,
    image: String,
    latitude: Number,
    longitude: Number,
    description: String,
    location: String
})

//module.exports = mongoose.model('Trip', TripSchema);
module.exports = mongoose.model('Trip', Trip2Schema)