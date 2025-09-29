const express = require("express");
const router = express.Router();
const isTeacher = require("../../middlewares/isTeacher");
const baiTapController = require("../../controllers/giangvien/baitapController");
const upload = require("../../middlewares/multer");
router.get("/", isTeacher, baiTapController.getKhoaHoc);


// Danh sách bài tập của khóa học
router.get("/khoa/:idKhoaHoc", isTeacher, baiTapController.listByCourse);

// Hiển thị form thêm bài tập
router.get("/khoa/:idKhoaHoc/them", isTeacher, baiTapController.showAddForm);

// Xử lý thêm bài tập
router.post(
    "/khoa/:idKhoaHoc/them",
    isTeacher,
    upload.single("fileDinhKem"),
    baiTapController.addBaiTap
);
// Hiển thị form sửa bài tập
router.post("/khoa/:idKhoaHoc/sua/:idBaiTap", isTeacher, upload.single("fileDinhKem"), baiTapController.updateBaiTap);

// Xóa bài tập
router.post("/khoa/:idKhoaHoc/xoa/:idBaiTap", isTeacher, baiTapController.deleteBaiTap);
module.exports = router;