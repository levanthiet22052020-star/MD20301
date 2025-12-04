const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const imageSchema = new Schema({
    id: { type: ObjectId }, // Trường ImageID (PK)
    productID: { type: ObjectId, ref: 'product', required: true }, // FK
    link: { type: String, required: true }, // URL hoặc path đến ảnh
});

module.exports = mongoose.models.Image || mongoose.model('Image', imageSchema);