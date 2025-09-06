const express = require("express");
const router = express.Router();
const cosoController = require("../controllers/cosoController");
const isAdmin = require("../middlewares/isAdmin");

router.get("/", isAdmin, cosoController.getAllCoSo);
module.exports = router;
