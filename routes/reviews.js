const express = require('express');
const router = express.Router({ mergeParams: true });
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Trip = require('../models/trip');
const Review = require('../models/review');
const {validateReview, isLoggedIn, isReviewAuthor} = require('../middleware');


router.post('/', isLoggedIn, validateReview, catchAsync(async (req, res) => {
    const trip = await Trip.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    trip.reviews.push(review);
    await review.save();
    await trip.save();
    req.flash('success', 'Review submitted!');
    res.redirect(`/trips/${trip._id}`);
}));

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(async (req, res) => {
    const {id, reviewId} = req.params;
    await Trip.findByIdAndUpdate(id, { $pull: { reviews: reviewId }});
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Review deleted successfully');
    res.redirect(`/trips/${id}`);
}))

module.exports = router;