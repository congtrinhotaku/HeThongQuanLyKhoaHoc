const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const giangVienSchema = new Schema({
  MaTaiKhoan: { type: Schema.Types.ObjectId, ref: "User", unique: true, required: true },
  hoTen: { type: String, required: true },
  ngaySinh: { type: Date },
  gioiTinh: { type: String, enum: ["Nam", "Nữ", "Khác"] },
  email: { type: String, unique: true, required: true },
  soDienThoai: { type: String, unique: true },
  soZalo: { type: String, unique: true },
  diaChi: { type: String },
  anhDaiDien: { type: String },
  faceDescriptor: { type: [Number], default: [] },

  // Thông tin bổ sung cho giảng viên
  trinhDo: { type: String }, // ví dụ: Thạc sĩ Ngôn ngữ Anh
  bangCap: { type: String }, // ví dụ: TESOL, CELTA
  soNamKinhNghiem: { type: Number, default: 0 },
  noiTungDay: { type: String }, // tên trung tâm/trường
  moTa: { type: String }, // mô tả ngắn về giảng viên

  // Điểm chứng chỉ
  diemIELTS: { type: Number, min: 0, max: 9 },
  diemTOEIC: { type: Number, min: 0, max: 990 },

  // Trạng thái giảng viên
  trangThai: { type: String, enum: ["Đang dạy", "Tạm nghỉ", "Đã nghỉ"], default: "Đang dạy" },
}, {
  timestamps: true
});

module.exports = mongoose.model("GiangVien", giangVienSchema);
