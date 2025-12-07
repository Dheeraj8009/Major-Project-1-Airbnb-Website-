const express = require('express');
const router = express.Router();
const wrapAsync = require ("../utils/wrapAsync.js");
const ExpressError = require ("../utils/ExpressError.js");
const { listingschema, reviewschema } = require('../schema.js');
const Listing = require('../models/listing');


const validateListing = (req,res,next) => {
  const { error } = listingschema.validate(req.body);

  if (error) {
    const msg = error.details.map(el => el.message).join(", ");
    throw new ExpressError(400, msg);
  } else {
    next();
  } 
};


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

router.get("/new", (req, res) => {
  res.render("listings/new.ejs");
});



// Show Route to display a specific listing
router.get("/:id", async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id).populate('reviews');
    if (!listing) {
      req.flash('error', 'Listing not found!');
      return res.redirect('/listings');

    }
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
  await newListing.save();
  req.flash('success', 'Successfully created a new listing!');
  res.redirect("/listings");
}));





//Edit Route to display form for editing a listing
router.get("/:id/edit", validateListing , wrapAsync(async (req, res) => {
    let {id} = req.params;

   

    const listing = await Listing.findById(id);

     if (!listing) {
      req.flash('error', 'Listing not found!');
      return res.redirect('/listings');
    }
    
    res.render("listings/edit.ejs", {listing});
}));


// Update Route to update a specific listing
router.put("/:id", wrapAsync(async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findByIdAndUpdate(id, req.body.listing, {new: true});
      req.flash('success', 'Successfully updated the listing!');
    res.redirect(`/listings/${listing._id}`);
}));


// Delete Route to delete a specific listing
router.delete("/:id", wrapAsync(async (req, res) => {
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
     req.flash('success', 'Successfully deleted the listing!');
    res.redirect("/listings");
}));


module.exports = router;