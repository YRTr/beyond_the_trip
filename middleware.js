const { tripSchema, reviewSchema } = require('./schemas');
const ExpressError = require('./utils/ExpressError');
const Trip = require('./models/trip');
const Review = require('./models/review')

module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You need to sign in!');
        return res.redirect('/login');
    }
    next();
}

module.exports.validateTrip = (req, res, next) => {
    const {error} = tripSchema.validate(req.body);
    if(error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

module.exports.validateReview = (req, res, next) => {
    const {error} = reviewSchema.validate(req.body);
    if(error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

module.exports.isAuthor = async (req, res, next) => {
    const {id} = req.params;
    const trip = await Trip.findById(id);
    if(!trip.author.equals(req.user._id)) {
        req.flash('error', "You're not authorised to modify!");
        return res.redirect(`/trips/${id}`);
    }
    next();
}

module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewid } = req.params;
    const trip = await Review.findById(reviewid);
    if(!review.author.equals(req.user._id)) {
        req.flash('error', "You're not authorised to modify!");
        return res.redirect(`/trips/${id}`);
    }
    next();
}