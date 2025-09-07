// routes/khoahocRoutes.js
const express = require("express");
const router = express.Router();
const khoaHocController = require("../../controllers/admin/khoahocController");

router.get("/", khoaHocController.getAllKhoaHoc);
router.get("/add", khoaHocController.getAddKhoaHoc);
router.post("/add", khoaHocController.postAddKhoaHoc);
router.post("/delete/:id", khoaHocController.deleteKhoaHoc);
router.get("/phong/:coSoId", khoaHocController.getPhongByCoSo);


router.get("/:id", khoaHocController.getChiTietKhoaHoc);
router.post("/update/:id", khoaHocController.postUpdateKhoaHoc);
router.post("/:khoaHocId/buoi/delete/:buoiId", khoaHocController.deleteBuoiHoc);

module.exports = router;
