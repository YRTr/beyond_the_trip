const Review = require('../models/review');
const Trip = require('../models/trip');

module.exports.createReview = async (req, res) => {
    const trip = await Trip.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    trip.reviews.push(review);
    await review.save();
    await trip.save();
    req.flash('success', 'Review submitted!');
    res.redirect(`/trips/${trip._id}`);
}

module.exports.deleteReview = async (req, res) => {
    const {id, reviewId} = req.params;
    await Trip.findByIdAndUpdate(id, { $pull: { reviews: reviewId }});
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Review deleted successfully');
    res.redirect(`/trips/${id}`);
}