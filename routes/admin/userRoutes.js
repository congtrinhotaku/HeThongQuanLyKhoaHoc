const express = require("express");
const router = express.Router();
const userController = require("../../controllers/admin/userController");
const isAdmin = require("../../middlewares/isAdmin");

router.get("/", isAdmin, userController.getAllUsers);
router.post("/add", isAdmin, userController.addUser);
router.post("/delete/:id", isAdmin, userController.deleteUser);
router.post("/change-password/:id", isAdmin, userController.changePassword);


module.exports = router;
