const express = require("express");
const router = express.Router();
const baiTapController = require("../../controllers/giangvien/baitapController");
const isAdmin = require("../../middlewares/isAdmin");
const isTeacher = require("../../middlewares/isTeacher");

// Danh sách bài tập
router.get("/", isTeacher, baiTapController.getAllBaiTap);

// Thêm bài tập
router.post("/add", isTeacher, baiTapController.addBaiTap);

// Trang chi tiết bài tập
router.get("/:id", isTeacher, baiTapController.getDetailBaiTap);

// Cập nhật bài tập
router.post("/:id", isTeacher, baiTapController.updateBaiTap);

// Xóa bài tập
router.post("/delete/:id", isTeacher, baiTapController.deleteBaiTap);

module.exports = router;
