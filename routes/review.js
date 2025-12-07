const express = require('express');
const router = express.Router({mergeParams: true });

const wrapAsync = require ("../utils/wrapAsync.js");
const ExpressError = require ("../utils/ExpressError.js");
const { listingschema, reviewschema } = require('../schema.js');
const Review = require('../models/review');
const Listing = require('../models/listing');


const validateReview = (req,res,next) => {
  const { error } = reviewschema.validate(req.body);
  if (error) {
    const msg = error.details.map(el => el.message).join(", ");
    throw new ExpressError(400, msg);
  } else {
    next();
  }
};

//Reviews
//Post Route to add a new review to a specific listing
router.post("/", validateReview,wrapAsync ( async (req, res) => {
  let  listing = await Listing.findById(req.params.id);

  let newReview = new Review(req.body.review);

  // Push review object directly
  listing.reviews.push(newReview);

  await newReview.save();
  await listing.save();
   req.flash('success', 'Successfully added a new review!');
  res.redirect(`/listings/${listing._id}`);
}));


// Delete Route to delete a specific review from a listing
router.delete("/:reviewId", wrapAsync ( async (req, res) => {
  const { id, reviewId } = req.params;
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted the review!');
  res.redirect(`/listings/${id}`);
}));

module.exports = router;