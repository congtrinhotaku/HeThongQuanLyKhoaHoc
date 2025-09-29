const express = require("express");
const router = express.Router();
const giangvienController = require("../../controllers/admin/giangvienController");
const upload = require("../../middlewares/multer");
const isAdmin = require("../../middlewares/isAdmin");
// Danh sách giảng viên
router.get("/", giangvienController.getAllGiangVien);

// Thêm giảng viên

router.post(
    "/add",
    upload.single("anhDaiDien"),
    isAdmin,
    giangvienController.postAddGiangVien
);
//sua
router.post(
    "/edit/:id",
    upload.single("anhDaiDien"),
    isAdmin,
    giangvienController.postEditGiangVien
);



// Xóa giảng viên
router.post("/delete/:id", giangvienController.postDeleteGiangVien);

module.exports = router;
