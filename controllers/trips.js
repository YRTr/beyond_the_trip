const Trip = require('../models/trip');
const mboxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mboxGeocoding({ accessToken: mapBoxToken });
const {cloudinary} = require("../cloudinary");

module.exports.index = async (req, res) => {
    const trips = await Trip.find({});
    res.render('trips/index', { trips });
}

module.exports.renderNewForm = (req, res) => {
    res.render('trips/new');
}

module.exports.createTrip = async (req, res, next) => {
    const geoData = await geocoder.forwardGeocode({
        query: `${req.body.trip.place}, ${req.body.trip.location}`,
        limit: 1
    }).send()
    console.log(geoData.body.features[0].geometry);
    const trip = new Trip(req.body.trip);
    trip.geometry = geoData.body.features[0].geometry;
    trip.images = req.files.map(f => ({url: f.path, filename: f.filename}));
    trip.author = req.user._id;
    await trip.save();
    //console.log(trip);
    req.flash('success', 'Successfully added to your bucket-list');
    res.redirect(`/trips/${trip._id}`);
}

module.exports.showTrip = async (req, res) => {
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
}

module.exports.renderEditForm = async (req, res) => {
    const {id} = req.params;
    const trip = await Trip.findById(id);
    if(!trip){
        req.flash('error', 'Cannot find that trip')
        return res.redirect('/trips');
    }
    res.render('trips/edit', { trip });
}

module.exports.updateTrip = async (req, res) => {
    const { id } = req.params;
    const trip = await Trip.findByIdAndUpdate(id, {...req.body.trip }, {new: true});
    const imgs = req.files.map(f => ({url: f.path, filename: f.filename}));
    trip.images.push(...imgs);
    await trip.save();
    if(req.body.deleteImages){
        for(let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await trip.updateOne({$pull: {images: {filename: {$in: req.body.deleteImages}}}})
        console.log(trip);
    }
    req.flash('success', 'Updated successfully');
    res.redirect(`/trips/${trip._id}`)
}

module.exports.deleteTrip = async (req, res) => {
    const { id } = req.params;
    await Trip.findByIdAndDelete(id);
    req.flash('success', 'Trip deleted successfully');
    res.redirect('/trips');
}