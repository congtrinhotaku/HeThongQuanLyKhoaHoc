const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const NghiPhepHocBuSchema = new Schema({
  hocVien: { type: Schema.Types.ObjectId, ref: "NguoiDung" },
  buoiHoc: { type: Schema.Types.ObjectId, ref: "BuoiHoc" },
  lyDo: { type: String },
  fileMinhChung: { type: String },
  buoiHocBu: { type: Schema.Types.ObjectId, ref: "BuoiHoc" },
  trangThai: { type: String, enum: ["Chờ duyệt", "Duyệt", "Từ chối"], default: "Chờ duyệt" }
});

module.exports = mongoose.model("NghiPhepHocBu", NghiPhepHocBuSchema);