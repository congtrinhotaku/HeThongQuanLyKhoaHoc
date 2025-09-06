//../models/User.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const NguoiDungSchema = new Schema({
  hoTen: { type: String, required: true },
  ngaySinh: { type: Date },
  gioiTinh: { type: String, enum: ["Nam", "Nữ", "Khác"] },
  email: { type: String, unique: true, required: true },
  soDienThoai: { type: String, unique: true },
  soZalo: { type: String, unique: true },
  matKhau: { type: String, required: true },
  diaChi: { type: String },
  anhDaiDien: { type: String },
  vaiTro: { type: String, enum: ["admin", "student", "teacher"], required: true },
  faceDescriptor: { type: [Number], default: [] },
  trangThai: { type: String, enum: ["Hoạt động", "Khóa"], default: "Hoạt động" }
});

module.exports = mongoose.model("NguoiDung", NguoiDungSchema);