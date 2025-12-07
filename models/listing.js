const mongoose = require('mongoose');
const reviewSchema = require('./review'); // import schema, not model
const Schema = mongoose.Schema;
const Review = require('./review.js');

const listingSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: {
    type: String,
    set: (v) =>
      v === ""
        ? "https://images.unsplash.com/photo-1669669259279-0014747f4444?..."
        : v,
    default:
      "https://images.unsplash.com/photo-1669669259279-0014747f4444?..."
  },
  price: { type: Number, required: true },
  location: { type: String, required: true },
  country: { type: String, required: true },

  reviews: [
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review',
    }
  ]
});

listingSchema.post('findOneAndDelete', async function(doc) {
  if (doc) {
      await Review.deleteMany({ 
          _id: { $in: doc.reviews }
      });
  }
});





const Listing = mongoose.model('Listing', listingSchema);
module.exports = Listing;