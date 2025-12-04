const mongoose = require('mongoose');
const image = require('./image');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const productSchema = new Schema({
    id: { type: ObjectId }, 
    image: { type: ObjectId, ref: 'image' },
    name: { type: String},
    description: { type: String},
    price: {type: Number},
    quantity: {type: Number},
    status: {type: Boolean},
    createAt: {type: Date},
    updateAt: {type: Date},
    cateID: { type: ObjectId, ref : 'category' },

});
module.exports = mongoose.models.product || mongoose.model('product', productSchema);