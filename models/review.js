const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const reviewSchema = new Schema({
    id: { type: ObjectId }, // Trường ReviewID (PK)
    userID: { type: ObjectId, ref: 'User', required: true }, // FK1
    productID: { type: ObjectId, ref: 'product', required: true }, // FK2
    rating: { type: Number, required: true, min: 1, max: 5 },
    description: { type: String },
    createAt: { type: Date, default: Date.now },
});

module.exports = mongoose.models.Review || mongoose.model('Review', reviewSchema);