const express = require("express");
const router = express.Router();
const kioskController = require("../controllers/kioskController");

router.get("/", kioskController.getKiosk);
router.post("/diemdanh", kioskController.postDiemDanh);
router.post("/confirm", kioskController.postConfirmAttendance);

module.exports = router;
