const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const cartSchema = new Schema({
    // Không cần id riêng nếu dùng PK kép, Mongoose sẽ tự tạo _id
    userID: { type: ObjectId, ref: 'User', required: true }, // PK, FK1
    productID: { type: ObjectId, ref: 'product', required: true }, // PK, FK2
    quantity: { type: Number, required: true, min: 1 },
    updateAt: { type: Date, default: Date.now },
});

// Thiết lập chỉ mục duy nhất cho bộ (userID, productID) để đảm bảo PK kép
cartSchema.index({ userID: 1, productID: 1 }, { unique: true });

module.exports = mongoose.models.Cart || mongoose.model('Cart', cartSchema);