const mongoose = require('mongoose');
const Review = require('./review');
const Schema = mongoose.Schema;

const TripSchema = new Schema({
    place: String,
    image: String,
    latitude: Number,
    longitude: Number,
    description: String,
    location: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
})

//middleware
TripSchema.post('findOneAndDelete', async function (doc) {
    if(doc){
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})

module.exports = mongoose.model('Trip', TripSchema);