const express = require("express");
const router = express.Router();
const cosoController = require("../controllers/coSoController");
const isAdmin = require("../middlewares/isAdmin");

router.get("/", isAdmin, cosoController.getAllCoSo);
router.post("/add", isAdmin, cosoController.addCoSo);
router.post("/edit/:id", isAdmin, cosoController.editCoSo);
router.post("/delete/:id", isAdmin, cosoController.deleteCoSo);

module.exports = router;
