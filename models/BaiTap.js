const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BaiTapSchema = new Schema({
  khoaHoc: { type: Schema.Types.ObjectId, ref: "KhoaHoc" },
  tieuDe: { type: String, required: true },
  noiDung: { type: String },
  fileDinhKem: { type: String },
  hanNop: { type: Date },
  ngayTao: { type: Date, default: Date.now }
});

module.exports = mongoose.model("BaiTap", BaiTapSchema);