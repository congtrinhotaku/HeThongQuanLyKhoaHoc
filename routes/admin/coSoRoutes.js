const express = require("express");
const router = express.Router();
const cosoController = require("../../controllers/admin/coSoController");
const isAdmin = require("../../middlewares/isAdmin");

router.get("/", isAdmin, cosoController.getAllCoSo);
router.post("/add", isAdmin, cosoController.addCoSo);

router.get("/:id", isAdmin, cosoController.getDetailCoSo);
router.post("/:id", isAdmin, cosoController.updateCoSo);
router.post("/delete/:id", isAdmin, cosoController.deleteCoSo);

// CRUD phòng học trong cơ sở
router.post("/:id/phonghoc/add", isAdmin, cosoController.addPhongHoc);
router.post("/:id/phonghoc/:phongId/edit", isAdmin, cosoController.updatePhongHoc);
router.post("/:id/phonghoc/:phongId/delete", isAdmin, cosoController.deletePhongHoc);

module.exports = router;
