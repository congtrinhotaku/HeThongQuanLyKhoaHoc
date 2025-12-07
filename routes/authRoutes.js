const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

router.get("/register", authController.getRegister);
router.post("/register", authController.postRegister);



router.get("/", authController.getLogin);
router.get("/login", authController.getLogin);
router.post("/login", authController.postLogin);
router.get("/logout", authController.logout);

router.get("/active", authController.getActivate);
router.post("/active", authController.postActivate);

module.exports = router;
