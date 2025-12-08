const express = require('express');
const router = express.Router();
const wrapAsync = require ("../utils/wrapAsync.js");
const ExpressError = require ("../utils/ExpressError.js");
const { listingSchema, reviewSchema } = require('../schema.js');
const Listing = require('../models/listing');
const {isLoggedIn, isOwner, validateListing} = require('../middleware.js');




//Index Route to display all listings
router.get("/", wrapAsync(async (req, res) => {
  try {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { listings: allListings });
  } catch (err) {
    res.status(500).send("Error retrieving listings: " + err);
  }
}));

// app.get("/listings/:id", wrapAsync(async (req, res, next) => {
//   const { id } = req.params;

//   if (!mongoose.Types.ObjectId.isValid(id)) {
//     throw new ExpressError(400, "Invalid listing ID format");
//   }

//   const listing = await Listing.findById(id);
//   if (!listing) {
//     throw new ExpressError(404, "Listing not found");
//   }

//   res.render("listings/show.ejs", { listing });
// }));



// New Route to display form for creating a new listing

router.get("/new", isLoggedIn,(req, res) => {
  res.render("listings/new.ejs");
});



// Show Route to display a specific listing
router.get("/:id", async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id).populate({path: "reviews", populate: {path : "author",},}).populate("owner");
    if (!listing) {
      req.flash('error', 'Listing not found!');
      return res.redirect('/listings');
    }
    console.log(listing);
    res.render("listings/show.ejs", { listing: listing });
  }
    catch (err) {   
    res.status(500).send("Error retrieving listing: " + err);
  }
});





// Create Route to add a new listing to the database



// app.post("/listings", wrapAsync ( async (req, res) => {
//   if (!req.body.listing) {
//     throw new ExpressError(400,"Send valid data for listing");
//   }
  
// //   let listing = req.body.listing;
//   const newListing = new Listing(req.body.listing);
//   await newListing.save();
//   res.redirect("/listings");
// //   console.log(listing);
//   })
// );


// app.post("/listings", wrapAsync(async (req, res) => {
//   // if (!req.body || !req.body.listing) {
//   //   throw new ExpressError(400, "Send valid data for listing");
//   // }
//   let result = listingschema.validate(req.body);
//   console.log(result);
//   const newListing = new Listing(req.body.listing);
//   await newListing.save();
//   res.redirect("/listings");
// }));

router.post("/", validateListing , wrapAsync(async (req, res) => {

  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  await newListing.save();
  req.flash('success', 'Successfully created a new listing!');
  res.redirect("/listings");
}));





//Edit Route to display form for editing a listing
router.get("/:id/edit", isLoggedIn, isOwner, validateListing , wrapAsync(async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
     if (!listing) {
      req.flash('error', 'Listing not found!');
      return res.redirect('/listings');
    }
    res.render("listings/edit.ejs", {listing});
}));


// Update Route to update a specific listing
router.put("/:id", isLoggedIn, isOwner, wrapAsync(async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findByIdAndUpdate(id, req.body.listing, {new: true});
      req.flash('success', 'Successfully updated the listing!');
    res.redirect(`/listings/${listing._id}`);
}));


// Delete Route to delete a specific listing
router.delete("/:id", isLoggedIn, isOwner, wrapAsync(async (req, res) => {
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted the listing!');
    res.redirect("/listings");
}));


module.exports = router;