const express = require("express");
const router = express.Router();
const profileController = require("../../controllers/giangvien/profileController");
const isTeacher = require("../../middlewares/isTeacher");
const upload = require("../../middlewares/multer");


router.get("/profile", isTeacher, profileController.getProfile);
router.post("/profile", isTeacher, profileController.updateProfile);


module.exports = router;
