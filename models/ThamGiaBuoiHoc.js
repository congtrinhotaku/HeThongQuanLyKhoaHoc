const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ThamGiaBuoiHocSchema = new Schema({
  hocVien: { type: Schema.Types.ObjectId, ref: "HocVien" },
  buoiHoc: { type: Schema.Types.ObjectId, ref: "BuoiHoc" },
  trangThai: { 
    type: String, 
    enum: ["Có mặt", "Vắng", "Có phép", "Học bù", "chưa"], 
    default: "chưa" 
  },
  anhChup: { type: String },
  ngayDiemDanh: { type: Date, default: Date.now }
});

module.exports = mongoose.model("ThamGiaBuoiHoc", ThamGiaBuoiHocSchema);
