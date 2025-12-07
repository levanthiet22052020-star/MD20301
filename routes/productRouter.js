var express = require('express');
var router = express.Router();
var productModel = require("../models/product");
var upload = require('../utils/Upload');
var sendMail = require('../utils/Mail');
var multer = require('multer');
var welcomeEmail = require('../utils/emailTemplate').welcomeEmail;

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/images'); 
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

var upload = multer({ storage: storage });

router.post("/add", async function (req, res) {
    try {
        const { name, description, price, quantity, status, cateID } = req.body;
        // Tạo object mới
        const newProduct = { 
            name, description, price, quantity, status, cateID,
            createAt: Date.now(),
            updateAt: Date.now()
        };
        await productModel.create(newProduct);
        res.status(201).json({ status: true, message: "Thêm sản phẩm thành công" });
    } catch (error) {
        res.status(400).json({ status: false, message: "Lỗi thêm sản phẩm", error: error.message });
    }
});

router.put("/update", async function (req, res) {
    try {
        const { id, name, description, price, quantity, status, cateID } = req.body;
        
        // Tìm và cập nhật luôn (new: true để trả về data mới sau khi update)
        const updatedItem = await productModel.findByIdAndUpdate(id, {
            name, description, price, quantity, status, cateID,
            updateAt: Date.now()
        }, { new: true });

        if (updatedItem) {
            res.status(200).json({ status: true, message: "Cập nhật thành công", data: updatedItem });
        } else {
            res.status(404).json({ status: false, message: "Không tìm thấy sản phẩm" });
        }
    } catch (error) {
        res.status(500).json({ status: false, message: "Lỗi server", error: error.message });
    }
});

router.delete("/delete", async function (req, res) {
    try {
        const { id } = req.query;
        const deletedItem = await productModel.findByIdAndDelete(id);
        if (deletedItem) {
            res.status(200).json({ status: true, message: "Xóa thành công" });
        } else {
            res.status(404).json({ status: false, message: "Không tìm thấy sản phẩm" });
        }
    } catch (error) {
        res.status(500).json({ status: false, message: "Lỗi xóa sản phẩm", error: error.message });
    }
});

router.get("/all", async (req, res) => {
    try {
        const data = await productModel.find();
        res.status(200).json({ status: true, count: data.length, data: data });
    } catch (e) { res.status(500).json({ message: e.message }); }
});

router.get("/detail/:id", async function (req, res) {
    try {
        const { id } = req.params;
        const item = await productModel.findById(id);
        if (item) {
            res.status(200).json({ status: true, data: item });
        } else {
            res.status(404).json({ status: false, message: "Không tìm thấy sản phẩm" });
        }
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
});

router.post('/upload', [upload.single('hinhAnh')],
    async (req, res, next) => {
        try {
            const { file } = req;
            if (!file) {
                return res.json({ status: 0, link: "" });
            } else {
                const url = `http://localhost:3000/images/${file.filename}`;
                return res.json({ status: 1, url: url });
            }
        } catch (error) {
            console.log('Upload image error: ', error);
            return res.json({ status: 0, link: "" });
        }
    });


    router.post('/uploads', [upload.array('image', 9)],
    async (req, res, next) => {
        try {
            const { files } = req;
            if (!files) {
               return res.json({ status: 0, link : [] }); 
            } else {
              const url = [];
              for (const singleFile of files) {
                url.push(`http://localhost:3000/images/${singleFile.filename}`);
              }
                return res.json({ status: 1, url : url });
            }
        } catch (error) {
            console.log('Upload image error: ', error);
            return res.json({status: 0, link : [] });
        }
    });
//Mail
router.post("/send-mail", async function(req, res, next){
  try{
    const {to, subject, content} = req.body;

    const mailOptions = {
      from: '"Cửa hàng MD20301" <zerosenpai3006@gmail.com>',
      to: to,
      subject: subject,
      html: welcomeEmail("Trí", "http://localhost:3000"),
    };
    await sendMail.transporter.sendMail(mailOptions);
    res.json({ status: 1, message: "Gửi mail thành công"});
// productRouter.js

  } catch (err) {
    console.log("Lỗi gửi mail chi tiết:", err); // Thêm dòng này để xem lỗi ở Terminal
    res.json({ status: 0, message: "Gửi mail thất bại", error: err.message }); // Trả lỗi về Postman để dễ nhìn
  }
});


/*
// q1: Giá > 50k
router.get("/filter-price-gt-50k", async (req, res) => {
    try {
        // $gt là greater than (lớn hơn)
        const data = await productModel.find({ price: { $gt: 50000 } });
        res.status(200).json({ status: true, data: data, message: "Lọc giá > 50k thành công" });
    } catch (e) { res.status(500).json({ message: e.message }); }
});

// q2: Số lượng < 10
router.get("/filter-qty-lt-10", async (req, res) => {
    try {
        // $lt là less than (nhỏ hơn)
        const data = await productModel.find({ quantity: { $lt: 10 } });
        res.status(200).json({ status: true, data: data });
    } catch (e) { res.status(500).json({ message: e.message }); }
});

// q3: Tên chứa 'socola' (Tìm tương đối)
router.get("/search-socola", async (req, res) => {
    try {
        // $regex: tìm chuỗi, $options: 'i' để không phân biệt hoa thường
        const data = await productModel.find({ name: { $regex: 'socola', $options: 'i' } });
        res.status(200).json({ status: true, data: data });
    } catch (e) { res.status(500).json({ message: e.message }); }
});

// q4: Sắp xếp giá tăng dần
router.get("/sort-price-asc", async (req, res) => {
    try {
        // sort: 1 là tăng dần, -1 là giảm dần
        const data = await productModel.find().sort({ price: 1 });
        res.status(200).json({ status: true, data: data });
    } catch (e) { res.status(500).json({ message: e.message }); }
});

// q5: Top 3 sản phẩm giá cao nhất
router.get("/top3-highest-price", async (req, res) => {
    try {
        const data = await productModel.find().sort({ price: -1 }).limit(3);
        res.status(200).json({ status: true, data: data });
    } catch (e) { res.status(500).json({ message: e.message }); }
});

// q6: Top 5 sản phẩm số lượng nhiều nhất
router.get("/top5-highest-qty", async (req, res) => {
    try {
        const data = await productModel.find().sort({ quantity: -1 }).limit(5);
        res.status(200).json({ status: true, data: data });
    } catch (e) { res.status(500).json({ message: e.message }); }
});

// q7: Sản phẩm tạo hôm nay
router.get("/created-today", async (req, res) => {
    try {
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        // Tìm trong khoảng từ đầu ngày đến cuối ngày
        const data = await productModel.find({ 
            createAt: { $gte: startOfDay, $lte: endOfDay } 
        });
        res.status(200).json({ status: true, data: data });
    } catch (e) { res.status(500).json({ message: e.message }); }
});

// q8: Giá từ 20k - 100k
router.get("/filter-price-range", async (req, res) => {
    try {
        const data = await productModel.find({ price: { $gte: 20000, $lte: 100000 } });
        res.status(200).json({ status: true, data: data });
    } catch (e) { res.status(500).json({ message: e.message }); }
});

// q9: Tên bắt đầu bằng 'Bánh'
router.get("/search-start-banh", async (req, res) => {
    try {
        // Regex ^Bánh nghĩa là bắt đầu bằng chữ Bánh
        const data = await productModel.find({ name: { $regex: '^Bánh', $options: 'i' } });
        res.status(200).json({ status: true, data: data });
    } catch (e) { res.status(500).json({ message: e.message }); }
});

// q10: Giá < 100k VÀ Số lượng > 20
router.get("/filter-multi-condition", async (req, res) => {
    try {
        const data = await productModel.find({ 
            price: { $lt: 100000 }, 
            quantity: { $gt: 20 } 
        });
        res.status(200).json({ status: true, data: data });
    } catch (e) { res.status(500).json({ message: e.message }); }
});

// q11: Giá < 100k VÀ Status True -> Sắp xếp giá giảm dần
router.get("/filter-sort-complex", async (req, res) => {
    try {
        const data = await productModel.find({ 
            price: { $lt: 100000 }, 
            status: true 
        }).sort({ price: -1 });
        res.status(200).json({ status: true, data: data });
    } catch (e) { res.status(500).json({ message: e.message }); }
});

// q12: Số lượng 10-30 VÀ Tên chứa 'bánh'
router.get("/filter-qty-name", async (req, res) => {
    try {
        const data = await productModel.find({ 
            quantity: { $gte: 10, $lte: 30 },
            name: { $regex: 'bánh', $options: 'i' }
        });
        res.status(200).json({ status: true, data: data });
    } catch (e) { res.status(500).json({ message: e.message }); }
});

// Lấy chi tiết theo ID
router.get("/detail/:id", async function (req, res) {
    try {
        const { id } = req.params;
        const item = await productModel.findById(id);
        if (item) {
            res.status(200).json({ status: true, data: item });
        } else {
            res.status(404).json({ status: false, message: "Không tìm thấy sản phẩm" });
        }
    } catch (e) { res.status(500).json({ message: e.message }); }
});

// 13. Name chứa “kem” hoặc “socola”, và giá > 200,000
router.get("/filter-complex-name-price", async (req, res) => {
    try {
        const data = await productModel.find({
            $or: [
                { name: { $regex: 'kem', $options: 'i' } },
                { name: { $regex: 'socola', $options: 'i' } }
            ],
            price: { $gt: 200000 }
        });
        res.status(200).json({ status: true, data: data });
    } catch (e) { res.status(500).json({ message: e.message }); }
});

// 14. Qty > 20, sắp xếp Qty giảm, Price tăng
router.get("/sort-qty-price", async (req, res) => {
    try {
        const data = await productModel.find({ quantity: { $gt: 20 } })
                                       .sort({ quantity: -1, price: 1 });
        res.status(200).json({ status: true, data: data });
    } catch (e) { res.status(500).json({ message: e.message }); }
});

// 15. Lấy theo cateID và loại bỏ status = false
router.get("/by-category/:cateID", async (req, res) => {
    try {
        const { cateID } = req.params;
        const data = await productModel.find({ cateID: cateID, status: true });
        res.status(200).json({ status: true, data: data });
    } catch (e) { res.status(500).json({ message: e.message }); }
});

// 16. Price thấp nhất
router.get("/lowest-price", async (req, res) => {
    try {
        const data = await productModel.find().sort({ price: 1 }).limit(1);
        res.status(200).json({ status: true, data: data[0] });
    } catch (e) { res.status(500).json({ message: e.message }); }
});

// 19. Tạo trong 7 ngày qua
router.get("/recent-7-days", async (req, res) => {
    try {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        
        const data = await productModel.find({ createAt: { $gte: sevenDaysAgo } });
        res.status(200).json({ status: true, data: data });
    } catch (e) { res.status(500).json({ message: e.message }); }
});

// 20. Chỉ lấy field name, price, quantity theo CateID
router.get("/category-projection/:cateID", async (req, res) => {
    try {
        const { cateID } = req.params;
        // select: chỉ định các field muốn lấy
        const data = await productModel.find({ cateID: cateID }).select('name price quantity');
        res.status(200).json({ status: true, data: data });
    } catch (e) { res.status(500).json({ message: e.message }); }
});

// 21. Giá 20k-200k & Tên KHÔNG chứa 'socola'
router.get("/price-range-no-socola", async (req, res) => {
    try {
        const data = await productModel.find({
            price: { $gte: 20000, $lte: 200000 },
            name: { $not: { $regex: 'socola', $options: 'i' } }
        });
        res.status(200).json({ status: true, data: data });
    } catch (e) { res.status(500).json({ message: e.message }); }
});*/

module.exports = router;