var express = require('express');
var router = express.Router();
var categoryModel = require("../models/Category");

// api 
//post: thêm, put: sửa, delete: xóa, get: lấy dữ liệu
//Post  http://localhost:3000/categories/add
router.post("/add", async function(req, res) {
    // lấy dữ liệu user gửi lên
    const { name, description, parentId } = req.body;

    //tạo object mới lưu vào db
    const newCategory = { name, description, parentId};

    //lưu vào db
    await categoryModel.create(newCategory);

    res.status(204).json({ status: true, message: "Category created successfully" });
})

router.put("/update", async function(req, res) {
    const { id, name, description, parentId } = req.body;
    const item = await categoryModel.findById(id);
    if (item) {
        //cập nhật dữ liệu
        item.name = name ? name : item.name;
        item.description = description ? description : item.description;
        item.parentId = parentId ? parentId : item.parentId;
        await item.save();
        res.status(200).json({ status: true, message: "Cập nhật thành công" });

    }else {
        res.status(200).json({ status: false, message: "Không tìm thấy" });
    }
    
});

router.delete("/delete", async function(req, res) {
    const { id } = req.query;
    const item = await categoryModel.findById(id);
    if (item) {
        await categoryModel.findByIdAndDelete(id);
        res.status(200).json({ status: true, message: "Xóa thành công" });

    }else {
        res.status(200).json({ status: true, message: "Xóa không thành công"});
    }
});

module.exports = router;