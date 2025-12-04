const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const userSchema = new Schema({
    id: { type: ObjectId }, // Trường ID (PK)
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String },
    role: { type: String, enum: ['admin', 'user'], default: 'user' }, // Ví dụ về vai trò
    status: { type: String, default: 'active' }, // Ví dụ về trạng thái
});

module.exports = mongoose.models.User || mongoose.model('User', userSchema);