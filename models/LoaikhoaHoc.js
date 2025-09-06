const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const LoaiKhoaHocSchema = new Schema({
  tenLoai: { type: String, unique: true, required: true },
  moTa: { type: String }
});

module.exports = mongoose.model("LoaiKhoaHoc", LoaiKhoaHocSchema);