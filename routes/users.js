var express = require('express');
var router = express.Router();
var userModel = require("../models/user");

router.get('/all', async function(req, res) {
  try {
    const users = await userModel.find();
    res.status(200).json({ status: true, data: users });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
});

router.get('/detail/:id', async function(req, res) {
  try {
    const { id } = req.params;
    const user = await userModel.findById(id);
    
    if (user) {
      res.status(200).json({ status: true, data: user });
    } else {
      res.status(404).json({ status: false, message: "Không tìm thấy người dùng" });
    }
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
});

router.post('/add', async function(req, res) {
  try {
    const { name, email, password, phone, role } = req.body;

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ status: false, message: "Email đã tồn tại" });
    }

    const newUser = { name, email, password, phone, role };
    await userModel.create(newUser);
    
    res.status(201).json({ status: true, message: "Thêm người dùng thành công" });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
});

router.put('/update/:id', async function(req, res) {
  try {
    const { id } = req.params;
    const { name, phone, role, status } = req.body;

    const updatedUser = await userModel.findByIdAndUpdate(id, {
      name, phone, role, status
    }, { new: true });

    if (updatedUser) {
      res.status(200).json({ status: true, message: "Cập nhật thành công", data: updatedUser });
    } else {
      res.status(404).json({ status: false, message: "Không tìm thấy user để sửa" });
    }
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
});

router.delete('/delete/:id', async function(req, res) {
  try {
    const { id } = req.params;
    const deletedUser = await userModel.findByIdAndDelete(id);

    if (deletedUser) {
      res.status(200).json({ status: true, message: "Xóa thành công" });
    } else {
      res.status(404).json({ status: false, message: "Không tìm thấy user để xóa" });
    }
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
});

module.exports = router;