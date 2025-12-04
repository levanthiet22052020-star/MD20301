const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const orderSchema = new Schema({
    id: { type: ObjectId }, // Trường OrderID (PK)
    userID: { type: ObjectId, ref: 'User', required: true }, // FK
    fullName: { type: String, required: true },
    address: { type: String, required: true },
    status: { type: String, enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'], default: 'pending' },
    paymentMethod: { type: String, required: true },
    createAt: { type: Date, default: Date.now },
});

module.exports = mongoose.models.Order || mongoose.model('Order', orderSchema);