const express = require("express");
const router = express.Router();
const profileController = require("../../controllers/giangvien/profileController");
const isTeacher = require("../../middlewares/isTeacher");
const upload = require("../../middlewares/multer");


router.get("/profile", isTeacher, profileController.getProfile);
router.post("/profile", isTeacher, profileController.updateProfile);
router.get("/xinnghi", isTeacher, profileController.getKhoaHoc);

router.get("/xinnghi/khoa/:khoaHocId", isTeacher, profileController.getDonNghiByKhoaHoc);
router.post("/xinnghi/duyet/:id",isTeacher, profileController.gvDuyetDon);
router.post("/xinnghi/tuchoi/:id",isTeacher, profileController.gvTuChoiDon);
module.exports = router;
