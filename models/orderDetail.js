const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const orderDetailSchema = new Schema({
    // Không cần id riêng nếu dùng PK kép, Mongoose sẽ tự tạo _id
    orderID: { type: ObjectId, ref: 'Order', required: true }, // PK, FK1
    productID: { type: ObjectId, ref: 'product', required: true }, // PK, FK2
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true, min: 0 }, // Giá tại thời điểm đặt hàng
});

// Thiết lập chỉ mục duy nhất cho bộ (orderID, productID) để đảm bảo PK kép
orderDetailSchema.index({ orderID: 1, productID: 1 }, { unique: true });

module.exports = mongoose.models.OrderDetail || mongoose.model('OrderDetail', orderDetailSchema);