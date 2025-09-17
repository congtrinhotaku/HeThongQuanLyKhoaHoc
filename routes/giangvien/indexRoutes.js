const express = require("express");
const router = express.Router();
const giangvienController = require("../../controllers/giangvien/giangvienController");
const isTeacher = require("../../middlewares/isTeacher");

router.get("/", isTeacher, giangvienController.getTrangchu);


module.exports = router;