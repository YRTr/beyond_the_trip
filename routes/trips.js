const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const trips = require('../controllers/trips');
const {isLoggedIn, validateTrip, isAuthor} = require('../middleware');
const multer = require('multer');
const {storage} = require('../cloudinary');
const upload = multer({ storage });

router.route('/')
        .get(catchAsync(trips.index))
        .post(isLoggedIn, upload.array('image'), validateTrip, catchAsync(trips.createTrip));

router.get('/new', isLoggedIn, trips.renderNewForm);

router.route('/:id')
        .get(catchAsync(trips.showTrip))
        .put(isLoggedIn, isAuthor, upload.array('image'), validateTrip, catchAsync(trips.updateTrip))
        .delete(isLoggedIn, isAuthor, catchAsync(trips.deleteTrip))
        

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(trips.renderEditForm));


module.exports = router;