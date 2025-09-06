const fs = require("fs");
const canvas = require("canvas");
const faceapi = require("../config/faceapi");
const HocVien = require("../models/HocVien");

// Middleware nhận diện khuôn mặt
const recognizeFace = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "Vui lòng chụp ảnh" });
    }

    const img = await canvas.loadImage(req.file.path);
    const detection = await faceapi
      .detectSingleFace(img)
      .withFaceLandmarks()
      .withFaceDescriptor();

    fs.unlinkSync(req.file.path);

    if (!detection) {
      return res.status(404).json({ success: false, type: "noface", message: "Không tìm thấy khuôn mặt" });
    }

    const descriptor = detection.descriptor;

    const hocViens = await HocVien.find({ faceDescriptor: { $exists: true, $ne: [] } });

    let minDistance = Infinity;
    let matchedHocVien = null;

    hocViens.forEach(hv => {
      const distance = Math.sqrt(
        hv.faceDescriptor.map((val, i) => (val - descriptor[i]) ** 2).reduce((a, b) => a + b, 0)
      );
      if (distance < minDistance) {
        minDistance = distance;
        matchedHocVien = hv;
      }
    });

    if (minDistance < 0.5) {
      req.matchedHocVien = matchedHocVien;
      next();
    } else {
      return res.status(404).json({ success: false, type: "notfound", message: "Không nhận diện được học viên" });
    }
  } catch (err) {
    console.error("❌ Lỗi nhận diện khuôn mặt:", err);
    res.status(500).json({ success: false, type: "error", message: "Lỗi hệ thống" });
  }
};

module.exports = recognizeFace;
