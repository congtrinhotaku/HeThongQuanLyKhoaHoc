const express = require("express");
const router = express.Router();
const kioskController = require("../../controllers/admin/kioskController");

router.get("/", kioskController.getKiosk);
router.post("/diemdanh", kioskController.postDiemDanh);

module.exports = router;
