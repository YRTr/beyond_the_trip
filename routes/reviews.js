const express = require('express');
const router = express.Router({ mergeParams: true });
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const { reviewSchema } = require('../schemas');
const Trip = require('../models/trip');
const Review = require('../models/review');

const validateReview = (req, res, next) => {
    const {error} = reviewSchema.validate(req.body);
    if(error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

router.post('/', validateReview, catchAsync(async (req, res) => {
    const trip = await Trip.findById(req.params.id);
    const review = new Review(req.body.review);
    trip.reviews.push(review);
    await review.save();
    await trip.save();
    res.redirect(`/trips/${trip._id}`);
}));

router.delete('/:reviewId', catchAsync(async (req, res) => {
    const {id, reviewId} = req.params;
    await Trip.findByIdAndUpdate(id, { $pull: { reviews: reviewId }});
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/trips/${id}`);
}))

module.exports = router;