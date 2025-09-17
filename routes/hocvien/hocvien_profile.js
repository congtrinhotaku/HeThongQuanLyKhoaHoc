const express = require("express");
const router = express.Router();
const profileController = require("../../controllers/hocvien/profile_controller");
const isStudent = require("../../middlewares/isStudents");
// GET trang thông tin cá nhân
router.get("/", isStudent, profileController.getProfile);

module.exports = router;