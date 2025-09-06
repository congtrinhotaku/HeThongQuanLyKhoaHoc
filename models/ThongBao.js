const ThongBaoSchema = new Schema({
  nguoiGui: { type: Schema.Types.ObjectId, ref: "NguoiDung" },
  nguoiNhan: { type: Schema.Types.ObjectId, ref: "NguoiDung" },
  khoaHoc: { type: Schema.Types.ObjectId, ref: "KhoaHoc" },
  noiDung: { type: String, required: true, maxlength: 500 },
  ngayGui: { type: Date, default: Date.now },
  loai: { type: String, enum: ["Hệ thống", "Giảng viên", "Admin"], default: "Hệ thống" }
});

