const express = require("express");
const router = express.Router();
const hocVienController = require("../../controllers/admin/hocVienController");
const upload = require("../../middlewares/multer");
const processFaceData = require("../../middlewares/faceProcessing");
const isAdmin = require("../../middlewares/isAdmin");

router.get("/", isAdmin, hocVienController.getAllHocVien);

router.post(
  "/add",
  upload.single("anhDaiDien"),
  processFaceData, isAdmin,
  hocVienController.postAddHocVien
);

router.post(
  "/update/:id",
  upload.single("anhDaiDien"),
  processFaceData, isAdmin,
  hocVienController.postUpdateHocVien
);

// hocVienRoutes.js
router.get("/search", isAdmin, hocVienController.searchHocVien);

// khoahocRoutes.js
router.post("/:id/dangky", isAdmin, hocVienController.dangKyKhoaHoc);
router.post("/:id/huy/:dkId", isAdmin, hocVienController.huyDangKy);
router.post("/delete/:id", isAdmin, hocVienController.deleteHocVien);

module.exports = router;
