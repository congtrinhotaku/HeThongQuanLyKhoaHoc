const express = require("express");
const router = express.Router();
const profileController = require("../../controllers/hocvien/profile_controller");
const isStudent = require("../../middlewares/isStudents");
const upload = require("../../middlewares/multer");


// GET trang thông tin cá nhân
router.get("/", isStudent, profileController.getProfile);
router.post("/update/:id", isStudent, profileController.postUpdateHocVien);
// Trang xin nghỉ phép/học bù
router.get("/xinnghi",isStudent, profileController.getNghiHoc); // bước 1: chọn khóa học
router.get("/xinnghi/khoa/:khoaHocId",isStudent, profileController.getBuoiHocTheoKhoa); // bước 2: chọn buổi học
router.post("/xinnghi", upload.single("fileMinhChung"),isStudent, profileController.postXinNghi); // gửi đơn
router.get("/xinnghi/danhsach", isStudent,profileController.getDanhSachXinNghi); // xem danh sách


module.exports = router;