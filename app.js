const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const { tripSchema } = require('./schemas');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
const Trip = require('./models/trip');

mongoose.connect('mongodb+srv://yrtravi:yrtravi@travel0.yaw7e.mongodb.net/beyond-the-trip?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})

const db = mongoose.connection;
db.on("error", console.error.bind(console, 'connection error:'));
db.once("open", () => {
    console.log("Database connected");
});

const app = express();


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.engine('ejs', ejsMate);
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

const validateTrip = (req, res, next) => {
    
    const {error} = tripSchema.validate(req.body);
    if(error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

app.get('/', (req, res) => {
    res.render('home');
})

app.get('/trips', catchAsync(async (req, res) => {
    const trips = await Trip.find({});
    res.render('trips/index', { trips });
}));

app.get('/trips/new', (req, res) => {
    res.render('trips/new');
});

app.post('/trips', validateTrip, catchAsync(async (req, res, next) => {
    //if(!req.body.trip) throw new ExpressError('Invalid data', 400);
    const trip = new Trip(req.body.trip);
    await trip.save();
    res.redirect(`/trips/${trip._id}`)
}));

app.get('/trips/:id', catchAsync(async (req, res) => {
    const trip = await Trip.findById(req.params.id);
    res.render('trips/show', { trip });
}));

app.get('/trips/:id/edit', catchAsync(async (req, res) => {
    const trip = await Trip.findById(req.params.id);
    res.render('trips/edit', { trip }); 
}));

app.put('/trips/:id', validateTrip, catchAsync(async (req, res) => {
    let { id } = req.params;
    const trip = await Trip.findByIdAndUpdate(id, {...req.body.trip }, {new: true});
    res.redirect(`/trips/${trip._id}`)
}));

app.delete('/trips/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    await Trip.findByIdAndDelete(id);
    res.redirect('/trips');
}));

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404));
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if(!err.message) err.message = 'Something went wrong!';
    res.status( statusCode ).render('error', {err}); 
})

app.listen(3000, () => {
    console.log('Serving on port 3000');
})