const express = require("express");
const router = express.Router();
const loaiController = require("../controllers/loaikhoahocController");
const isAdmin = require("../middlewares/isAdmin");

router.get("/", isAdmin, loaiController.getAllLoai);
router.post("/add", isAdmin, loaiController.addLoai);

router.get("/:id", isAdmin, loaiController.getDetailLoai);
router.post("/:id", isAdmin, loaiController.updateLoai);
router.post("/delete/:id", isAdmin, loaiController.deleteLoai);

// Lesson trong loại khóa học
router.post("/:id/lesson/add", isAdmin, loaiController.addLesson);
router.post("/:id/lesson/:lessonId/edit", isAdmin, loaiController.updateLesson);
router.post("/:id/lesson/:lessonId/delete", isAdmin, loaiController.deleteLesson);

module.exports = router;
