const mongoose = require("mongoose");
const Schema = mongoose.Schema; 

const PhongHocSchema = new Schema({
  tenPhong: { type: String, required: true },
  sucChua: { type: Number },
  coSo: { type: Schema.Types.ObjectId, ref: "CoSo", required: true }
});

module.exports = mongoose.model("PhongHoc", PhongHocSchema);