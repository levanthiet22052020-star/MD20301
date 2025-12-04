// emailTemplate.js

// Mẫu 1: Email chào mừng / Xác thực
const welcomeEmail = (name, link) => {
    return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <div style="text-align: center; margin-bottom: 20px;">
            <h2 style="color: #4CAF50;">Chào mừng đến với Cửa hàng!</h2>
        </div>
        <div style="color: #333; line-height: 1.6;">
            <p>Xin chào <strong>${name}</strong>,</p>
            <p>Cảm ơn bạn đã đăng ký tài khoản tại hệ thống của chúng tôi. Chúng tôi rất vui khi có bạn đồng hành.</p>
            <p>Vui lòng nhấn vào nút bên dưới để xác thực tài khoản hoặc truy cập trang chủ:</p>
            <div style="text-align: center; margin: 30px 0;">
                <a href="${link}" style="background-color: #4CAF50; color: white; padding: 12px 25px; text-decoration: none; border-radius: 4px; font-weight: bold;">Truy cập ngay</a>
            </div>
            <p>Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email này.</p>
        </div>
        <div style="margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px; text-align: center; color: #888; font-size: 12px;">
            <p>&copy; 2024 MD20301 Store. All rights reserved.</p>
        </div>
    </div>
    `;
};


module.exports = { welcomeEmail};