const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    bookId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book',
    },
    reviewerName: String,
    content: String,
    rating: Number,
})

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;