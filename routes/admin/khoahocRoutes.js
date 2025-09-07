// routes/khoahocRoutes.js
const express = require("express");
const router = express.Router();
const khoaHocController = require("../../controllers/admin/khoahocController");
const isAdmin = require("../../middlewares/isAdmin");


router.get("/", khoaHocController.getAllKhoaHoc);
router.get("/add", khoaHocController.getAddKhoaHoc);
router.post("/add", khoaHocController.postAddKhoaHoc);
router.post("/delete/:id", khoaHocController.deleteKhoaHoc);
router.get("/phong/:coSoId", khoaHocController.getPhongByCoSo);
router.get("/:id/buoi/:buoiId",isAdmin, khoaHocController.chiTietBuoi);


router.get("/:id", khoaHocController.getChiTietKhoaHoc);
router.post("/update/:id", khoaHocController.postUpdateKhoaHoc);
router.post("/:khoaHocId/buoi/delete/:buoiId", khoaHocController.deleteBuoiHoc);

module.exports = router;
