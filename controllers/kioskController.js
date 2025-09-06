const multer = require("multer");
const fs = require("fs");
const path = require("path");
const canvas = require("canvas");
const faceapi = require("../config/faceapi");
const HocVien = require("../models/HocVien");
const { image } = require("@tensorflow/tfjs");
const recognizeFace = require("../middlewares/faceRecognition");


const upload = multer({ dest: "uploads/" });

// Render kiosk page
exports.getKiosk = (req, res) => {
  res.render("kiosk/index", { layout: false });
};

// Điểm danh bằng ảnh chụp
// Điểm danh
// Route điểm danh
exports.postDiemDanh = [
  upload.single("face"),
  recognizeFace, // middleware nhận diện khuôn mặt
  async (req, res) => {
    try {
      // Khi tới đây, req.matchedHocVien đã có học viên trùng
      const hv = req.matchedHocVien;

      return res.json({
        success: true,
        type: "matched",
        _id: hv._id,
        hoTen: hv.hoTen,
        email: hv.email,
        soDienThoai: hv.soDienThoai,
        anhDaiDien: hv.anhDaiDien || null
      });
    } catch (err) {
      console.error("❌ Lỗi điểm danh:", err);
      res.status(500).json({ success: false, message: "Lỗi hệ thống" });
    }
  }
];


