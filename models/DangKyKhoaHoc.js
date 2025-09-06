const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DangKyKhoaHocSchema = new Schema({
  hocVien: { type: Schema.Types.ObjectId, ref: "NguoiDung" },
  khoaHoc: { type: Schema.Types.ObjectId, ref: "KhoaHoc" },
  ngayDangKy: { type: Date, default: Date.now },
  trangThai: { type: String, enum: ["Đang học", "Hoàn thành", "Hủy"], default: "Đang học" }
}); 

module.exports = mongoose.model("DangKyKhoaHoc", DangKyKhoaHocSchema);