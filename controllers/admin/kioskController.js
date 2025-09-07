const multer = require("multer");
const fs = require("fs");
const path = require("path");
const canvas = require("canvas");
const faceapi = require("../../config/faceapi");
const HocVien = require("../../models/HocVien");
const BuoiHoc = require("../../models/BuoiHoc");
const ThamGiaBuoiHoc = require("../../models/ThamGiaBuoiHoc");
const DangKyKhoaHoc = require("../../models/DangKyKhoaHoc");
const { image } = require("@tensorflow/tfjs");
const recognizeFace = require("../../middlewares/faceRecognition");


const upload = multer({ dest: "uploads/" });

// Render kiosk page
exports.getKiosk = (req, res) => {
  res.render("kiosk/index", { layout: false });
};



exports.postDiemDanh = [
  upload.single("face"),
  recognizeFace,
  async (req, res) => {
    try {
      const hv = req.matchedHocVien;
      if (!hv) {
        console.log("❌ Không nhận diện được học viên");
        return res.json({ success: false, message: "Không nhận diện được học viên" });
      }

      // giờ hiện tại theo VN
      const nowVN = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Ho_Chi_Minh" }));
      const startOfDay = new Date(nowVN); startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(nowVN); endOfDay.setHours(23, 59, 59, 999);

      // tìm buổi học trong ngày
      const buoiHoc = await BuoiHoc.findOne({
        ngayHoc: { $gte: startOfDay, $lte: endOfDay }
      })
        .populate("lesson")
        .populate("phongHoc")
        .populate("khoaHoc");

      console.log("🔍 Học viên:", hv.hoTen);
      console.log("🔍 Giờ VN hiện tại:", nowVN);
      console.log("🔍 Buổi học:", buoiHoc);

      if (!buoiHoc) {
        return res.json({
          success: false,
          hocVien: {
            _id: hv._id,
            hoTen: hv.hoTen,
            email: hv.email,
            soDienThoai: hv.soDienThoai,
            anhDaiDien: hv.anhDaiDien || null
          },
          message: "Không có buổi học hôm nay"
        });
      }

      // kiểm tra giờ học
      const [gioBD, phutBD] = buoiHoc.gioBatDau.split(":").map(Number);
      const [gioKT, phutKT] = buoiHoc.gioKetThuc.split(":").map(Number);
      const currentMinutes = nowVN.getHours() * 60 + nowVN.getMinutes();
      const startMinutes = gioBD * 60 + phutBD - 60; // cho phép trước 1h
      const endMinutes = gioKT * 60 + phutKT + 60;   // cho phép sau 1h

      if (currentMinutes < startMinutes || currentMinutes > endMinutes) {
        return res.json({
          success: false,
          hocVien: {
            _id: hv._id,
            hoTen: hv.hoTen,
            email: hv.email,
            soDienThoai: hv.soDienThoai,
            anhDaiDien: hv.anhDaiDien || null
          },
          message: "Chưa đến giờ hoặc đã hết giờ điểm danh"
        });
      }

      // ✅ format ngày VN cho đẹp
      const ngayVN = buoiHoc.ngayHoc
        ? new Date(buoiHoc.ngayHoc).toLocaleDateString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" })
        : null;

      return res.json({
        success: true,
        hocVien: {
          _id: hv._id,
          hoTen: hv.hoTen,
          email: hv.email,
          soDienThoai: hv.soDienThoai,
          anhDaiDien: hv.anhDaiDien || null
        },
        khoaHoc: {
          _id: buoiHoc.khoaHoc?._id,
          tenKhoaHoc: buoiHoc.khoaHoc?.tenKhoaHoc
        },
        buoiHoc: {
          _id: buoiHoc._id,
          ngayHoc: ngayVN,
          gioBatDau: buoiHoc.gioBatDau,
          gioKetThuc: buoiHoc.gioKetThuc,
          trangThai: buoiHoc.trangThai,
          lesson: buoiHoc.lesson
            ? { _id: buoiHoc.lesson._id, tenBai: buoiHoc.lesson.tenBai }
            : null,
          phongHoc: buoiHoc.phongHoc
            ? { _id: buoiHoc.phongHoc._id, tenPhong: buoiHoc.phongHoc.tenPhong }
            : null
        }
      });

    } catch (err) {
      console.error("❌ Lỗi điểm danh:", err);
      res.status(500).json({ success: false, message: "Lỗi hệ thống" });
    }
  }
];
