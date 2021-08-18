if(process.env.NODE_ENV !== "production"){
    require('dotenv').config();
}

console.log(process.env.CLOUDINARY_CLOUD_NAME);

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const dbUrl = process.env.DB_URL;
const secret = process.env.SECRET || 'notabettersecret';
const MongoStore = require('connect-mongo');

const tripsRoutes = require('./routes/trips');
const reviewsRoutes = require('./routes/reviews');
const userRoutes = require('./routes/users');


mongoose.connect(dbUrl, {
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

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));


app.use(
    session({
      store: MongoStore.create({ mongoUrl: dbUrl }),
      secret,
      touchAfter: 24 * 60 * 60,
      resave: false,
      saveUninitialized: true,
      cookies: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
        }
    })
);


app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use(flash());
app.use((req, res, next) => {
    //console.log(req.session);
    //console.log(req.user);
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})


app.use('/', userRoutes);
app.use('/trips', tripsRoutes);
app.use('/trips/:id/reviews', reviewsRoutes);


app.get('/', (req, res) => {
    res.render('home');
})

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404));
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if(!err.message) err.message = 'Something went wrong!';
    res.status( statusCode ).render('error', {err}); 
})

const port = process.env.PORT || 5500;

app.listen(port, () => {
    console.log(`Serving on port ${port}`);
})