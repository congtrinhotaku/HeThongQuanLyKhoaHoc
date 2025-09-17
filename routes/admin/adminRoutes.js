const express = require("express");
const router = express.Router();
const cosoController = require("../../controllers/admin/coSoController");
const nghiHocController = require("../../controllers/admin/nghiHoc");
const isAdmin = require("../../middlewares/isAdmin");

router.get("/", isAdmin, cosoController.getAllCoSo);

// Trang danh sách đơn xin nghỉ
router.get("/nghiphep",isAdmin,  nghiHocController.getDanhSachDonNghi);

// Duyệt đơn
router.post("/nghiphep/:id/duyet",isAdmin,  nghiHocController.postDuyetDon);

// Từ chối đơn
router.post("/nghiphep/:id/tuchoi",isAdmin,  nghiHocController.postTuChoiDon);

module.exports = router;
