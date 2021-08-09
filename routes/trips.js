const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const { tripSchema } = require('../schemas');
const Trip = require('../models/trip');

const validateTrip = (req, res, next) => {
    
    const {error} = tripSchema.validate(req.body);
    if(error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

router.get('/', catchAsync(async (req, res) => {
    const trips = await Trip.find({});
    res.render('trips/index', { trips });
}));

router.get('/new', (req, res) => {
    res.render('trips/new');
});

router.post('/', validateTrip, catchAsync(async (req, res, next) => {
    //if(!req.body.trip) throw new ExpressError('Invalid data', 400);
    const trip = new Trip(req.body.trip);
    await trip.save();
    res.redirect(`/trips/${trip._id}`)
}));

router.get('/:id', catchAsync(async (req, res) => {
    const trip = await Trip.findById(req.params.id).populate('reviews');
    res.render('trips/show', { trip });
}));

router.get('/:id/edit', catchAsync(async (req, res) => {
    const trip = await Trip.findById(req.params.id);
    res.render('trips/edit', { trip }); 
}));

router.put('/:id', validateTrip, catchAsync(async (req, res) => {
    let { id } = req.params;
    const trip = await Trip.findByIdAndUpdate(id, {...req.body.trip }, {new: true});
    res.redirect(`/trips/${trip._id}`)
}));

router.delete('/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    await Trip.findByIdAndDelete(id);
    res.redirect('/trips');
}));

module.exports = router;