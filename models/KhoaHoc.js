const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const KhoaHocSchema = new Schema({
  tenKhoaHoc: { type: String, required: true },
  loaiKhoaHoc: { type: Schema.Types.ObjectId, ref: "LoaiKhoaHoc" },
  giangVien: [{ type: Schema.Types.ObjectId, ref: "GiangVien" }],
  hocPhi: { type: Number },
  soLuongToiDa: { type: Number },
  thoiGianBatDau: { type: Date },
  thoiGianKetThuc: { type: Date },
  lichHoc: [
    {
      thu: { type: Number },      
      gioBatDau: { type: String },
      gioKetThuc: { type: String }
    }
  ],
  phongHoc: { type: Schema.Types.ObjectId, ref: "PhongHoc" },
  trangThai: { type: String, enum: ["Đang mở", "Đã kết thúc"], default: "Đang mở" }
});

module.exports = mongoose.model("KhoaHoc", KhoaHocSchema);