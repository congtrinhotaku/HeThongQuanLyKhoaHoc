const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BaiLamSchema = new Schema({
  baiTap: { type: Schema.Types.ObjectId, ref: "BaiTap" },
  hocVien: { type: Schema.Types.ObjectId, ref: "NguoiDung" },
  fileNop: { type: String },
  ngayNop: { type: Date, default: Date.now },
  trangThai: { type: String, enum: ["Chờ", "Pass", "Fail"], default: "Chờ" },
  nhanXetGV: { type: String }
});

module.exports = mongoose.model("BaiLam", BaiLamSchema);