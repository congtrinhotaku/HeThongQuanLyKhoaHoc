const express = require("express");
const router = express.Router();
const hocVienController = require("../../controllers/giangvien/dshvController");
const isTeacher = require("../../middlewares/isTeacher");

// Chọn khóa học để xem học viên
router.get("/hocvien", isTeacher, hocVienController.getKhoaHocForHocVien);
router.get("/hocvien/khoa/:idKhoaHoc", isTeacher, hocVienController.getHocVienByKhoaHoc);


module.exports = router;
