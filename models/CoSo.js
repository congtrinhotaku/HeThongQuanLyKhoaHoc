const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CoSoSchema = new Schema({
  tenCoSo: { type: String, unique: true, required: true },
  diaChi: { type: String, required: true },
  soDienThoai: { type: String }
});

module.exports = mongoose.model("CoSo", CoSoSchema);