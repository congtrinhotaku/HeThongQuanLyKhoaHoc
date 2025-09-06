const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BuoiHocSchema = new Schema({
  khoaHoc: { type: Schema.Types.ObjectId, ref: "KhoaHoc" },
  lesson: { type: Schema.Types.ObjectId, ref: "Lesson" },
  phongHoc: { type: Schema.Types.ObjectId, ref: "PhongHoc" },
  ngayHoc: { type: Date, required: true },
  gioBatDau: { type: String },
  gioKetThuc: { type: String },
  trangThai: { type: String, enum: ["Bình thường", "Học bù"], default: "Bình thường" }
});

module.exports = mongoose.model("BuoiHoc", BuoiHocSchema);