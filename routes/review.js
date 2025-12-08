const express = require('express');
const router = express.Router({mergeParams: true });

const wrapAsync = require ("../utils/wrapAsync.js");
const ExpressError = require ("../utils/ExpressError.js");
const { listingschema, reviewschema } = require('../schema.js');
const Review = require('../models/review');
const Listing = require('../models/listing');
const {isLoggedIn, validateReview, isReviewAuthor} = require('../middleware.js');



//Reviews
//Post Route to add a new review to a specific listing
router.post("/", isLoggedIn, validateReview,wrapAsync ( async (req, res) => {
  let  listing = await Listing.findById(req.params.id);

  let newReview = new Review(req.body.review);
  newReview.author = req.user._id;
  // Push review object directly
  listing.reviews.push(newReview);

  await newReview.save();
  await listing.save();
   req.flash('success', 'Successfully added a new review!');
  res.redirect(`/listings/${listing._id}`);
}));


// Delete Route to delete a specific review from a listing
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync ( async (req, res) => {
  const { id, reviewId } = req.params;
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted the review!');
  res.redirect(`/listings/${id}`);
}));

module.exports = router;