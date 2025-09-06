const { Unique } = require("@tensorflow/tfjs-node");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const hocVienSchema = new Schema({
    MaTaiKhoan: {  type: Schema.Types.ObjectId, ref: "User", Unique:true },
    hoTen: { type: String, required: true },
    ngaySinh: { type: Date },
    gioiTinh: { type: String, enum: ["Nam", "Nữ", "Khác"] },
    email: { type: String, unique: true, required: true },
    soDienThoai: { type: String, unique: true },
    soZalo: { type: String, unique: true },
    diaChi: { type: String },
    anhDaiDien: { type: String },
    faceDescriptor: { type: [Number], default: [] },
});


module.exports = mongoose.model("HocVien", hocVienSchema);