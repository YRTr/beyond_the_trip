const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Trip = require('../models/trip');
const {isLoggedIn, validateTrip, isAuthor} = require('../middleware');


router.get('/', catchAsync(async (req, res) => {
    const trips = await Trip.find({});
    res.render('trips/index', { trips });
}));

router.get('/new', isLoggedIn, (req, res) => {
    res.render('trips/new');
});

router.post('/', isLoggedIn, validateTrip, catchAsync(async (req, res, next) => {
    const trip = new Trip(req.body.trip);
    trip.author = req.user._id;
    await trip.save();
    req.flash('success', 'Successfully added to your bucket-list');
    res.redirect(`/trips/${trip._id}`)
}));

router.get('/:id', catchAsync(async (req, res) => {
    const trip = await Trip.findById(req.params.id).populate({
        path:'reviews',
        populate: { path: 'author' }
    }).populate('author');
    console.log(trip);
    if(!trip){
        req.flash('error', 'Cannot find that trip')
        return res.redirect('/trips');
    }
    res.render('trips/show', { trip });
}));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const {id} = req.params;
    const trip = await Trip.findById(id);
    if(!trip){
        req.flash('error', 'Cannot find that trip')
        return res.redirect('/trips');
    }
    res.render('trips/edit', { trip });
}));

router.put('/:id', isLoggedIn, isAuthor, validateTrip, catchAsync(async (req, res) => {
    const { id } = req.params;
    const trip = await Trip.findByIdAndUpdate(id, {...req.body.trip }, {new: true});
    req.flash('success', 'Updated successfully');
    res.redirect(`/trips/${trip._id}`)
}));

router.delete('/:id', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const { id } = req.params;
    await Trip.findByIdAndDelete(id);
    req.flash('success', 'Trip deleted successfully');
    res.redirect('/trips');
}));

module.exports = router;