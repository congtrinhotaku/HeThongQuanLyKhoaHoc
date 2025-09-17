const express = require("express");
const router = express.Router();
const khoahocController = require("../../controllers/giangvien/khoahocController");
const isTeacher = require("../../middlewares/isTeacher");

// Trang chi tiết khóa học
router.get("/:id", isTeacher, khoahocController.getChiTietKhoaHoc);

module.exports = router;
