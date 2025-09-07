const express = require("express");
const router = express.Router();
const giangvienController = require("../../controllers/admin/giangvienController");

// Danh sách giảng viên
router.get("/", giangvienController.getAllGiangVien);

// Thêm giảng viên
router.post("/add", giangvienController.postAddGiangVien);

// Sửa giảng viên
router.post("/edit/:id", giangvienController.postEditGiangVien);

// Xóa giảng viên
router.post("/delete/:id", giangvienController.postDeleteGiangVien);

module.exports = router;
