const nodemailer = require("nodemailer");

// Cấu hình gửi mail (sử dụng Gmail)
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "zerosenpai3006@gmail.com", // Thay bằng email của bạn
        pass: "kfrl scbp udhb lgdu"  // Thay bằng Mật khẩu ứng dụng (Xem hướng dẫn dưới)
    }
});

module.exports = { transporter };