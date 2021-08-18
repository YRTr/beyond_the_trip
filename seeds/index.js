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
            author: '6114c92d634ad46498dd84c5',
            place: `${places[i].place}`,
            description: `${places[i].description}`,
            location: `${places[i].location}`,
            images: [
                  {
                    url: 'https://res.cloudinary.com/yrtr/image/upload/v1629050587/BeyondTheTrip/yl5ohxu9quz4qzyr2pc9.jpg',
                    filename: 'BeyondTheTrip/yl5ohxu9quz4qzyr2pc9'
                  },
                  {
                    url: 'https://res.cloudinary.com/yrtr/image/upload/v1629050588/BeyondTheTrip/tonjphm6alccutfiqlzd.jpg',
                    filename: 'BeyondTheTrip/tonjphm6alccutfiqlzd'
                  }
            ]
        })
        await t.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
});