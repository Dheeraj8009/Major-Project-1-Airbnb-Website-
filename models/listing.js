const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review.js');

const listingSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },

  // Store both Cloudinary URL and public_id
  image: {
    url: {
      type: String,
      default:
        "https://images.unsplash.com/photo-1669669259279-0014747f4444?...",
      set: (v) =>
        v === ""
          ? "https://images.unsplash.com/photo-1669669259279-0014747f4444?..."
          : v,
    },
    public_id: {
      type: String,
      default: null, // will be set when uploaded to Cloudinary
    },
  },

  price: { type: Number, required: true },
  location: { type: String, required: true },
  country: { type: String, required: true },

  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Review',
    }
  ],

  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },

  geometry: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  }
  
});

// Cascade delete reviews when a listing is deleted
listingSchema.post('findOneAndDelete', async function(doc) {
  if (doc) {
    await Review.deleteMany({
      _id: { $in: doc.reviews }
    });
  }
});

const Listing = mongoose.model('Listing', listingSchema);
module.exports = Listing;