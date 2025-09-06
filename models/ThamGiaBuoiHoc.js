const ThamGiaBuoiHocSchema = new Schema({
  hocVien: { type: Schema.Types.ObjectId, ref: "NguoiDung" },
  buoiHoc: { type: Schema.Types.ObjectId, ref: "BuoiHoc" },
  trangThai: { type: String, enum: ["Có mặt", "Vắng", "Có phép", "Học bù"], default: "Có mặt" },
  anhChup: { type: String }, 
  ngayDiemDanh: { type: Date, default: Date.now }
});