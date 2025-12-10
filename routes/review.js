const express = require('express');
const router = express.Router({mergeParams: true });

const wrapAsync = require ("../utils/wrapAsync.js");
const ExpressError = require ("../utils/ExpressError.js");
const { listingschema, reviewschema } = require('../schema.js');
const Review = require('../models/review');
const Listing = require('../models/listing');
const {isLoggedIn, validateReview, isReviewAuthor} = require('../middleware.js');
const reviewController = require('../controllers/reviews.js');


//Reviews
//Post Route to add a new review to a specific listing
router.post("/", isLoggedIn, validateReview,wrapAsync (reviewController.createReview));


// Delete Route to delete a specific review from a listing
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync (reviewController.destroyReview));

module.exports = router;