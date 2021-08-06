const mongoose = require('mongoose');
const Trip = require('../models/trip');
const places = require('./places');

mongoose.connect('mongodb+srv://yrtravi:yrtravi@travel0.yaw7e.mongodb.net/beyond-the-trip?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
})

const db = mongoose.connection;
db.on("error", console.error.bind(console, 'connection error:'));
db.once("open", () => {
    console.log("Database connected");
});

const seedDB = async () => {
    await Trip.deleteMany();
    for(let i=0; i<places.length; i++){
        let t = new Trip({
            place: `${places[i].place}`,
            image: 'https://source.unsplash.com/collection/2170690',
            latitude: `${places[i].latitude}`,
            longitude: `${places[i].longitude}`,
            description: `${places[i].description}`,
            location: `${places[i].location}`
        })
        await t.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})