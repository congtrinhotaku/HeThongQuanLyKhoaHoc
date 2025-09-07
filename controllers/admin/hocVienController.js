// controllers/hocVienController.js
const { exp } = require("@tensorflow/tfjs-node");
const HocVien = require("../../models/HocVien");
const BuoiHoc = require("../../models/BuoiHoc");
const ThamGiaBuoiHoc = require("../../models/ThamGiaBuoiHoc");
const DangKyKhoaHoc = require("../../models/DangKyKhoaHoc");

const User = require("../../models/User");
const fs = require("fs");

// Danh sách học viên
exports.getAllHocVien = async (req, res) => {
  try {
    const dsHocVien = await HocVien.find()
      .populate("MaTaiKhoan") // hiển thị thông tin user
      .lean();

    res.render("admin/hocvien", {
      layout: "layouts/main",
      title: "Quản lý Học Viên",
      user: req.user,
      dsHocVien,
    });
  } catch (err) {
    console.error("❌ Lỗi getAllHocVien:", err);
    res.redirect("/admin");
  }
};

// Thêm học viên
exports.postAddHocVien = async (req, res) => {
  try {
    const { hoTen, ngaySinh, gioiTinh, email, soDienThoai, soZalo, diaChi } =
      req.body;

    // Sinh mật khẩu mặc định: chữ cuối họ tên không dấu + 4 số cuối SĐT
    let matKhauMacDinh = "123456";
    if (hoTen && soDienThoai) {
      const lastName = hoTen
        .trim()
        .split(" ")
        .slice(-1)[0]
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
      const fourDigits = soDienThoai.slice(-4);
      matKhauMacDinh = lastName.toLowerCase() + fourDigits;
    }

    // 1) Tạo tài khoản User
    const user = await User.create({
      username: hoTen,
      email,
      password: matKhauMacDinh,
      role: "student",
    });

    // 2) Tạo hồ sơ học viên
    await HocVien.create({
      MaTaiKhoan: user._id,
      hoTen,
      ngaySinh,
      gioiTinh,
      email,
      soDienThoai,
      soZalo,
      diaChi,
      anhDaiDien: req.file ? `/uploads/${req.file.filename}` : null,
      faceDescriptor: req.faceDescriptor
        ? Array.from(req.faceDescriptor)
        : [],
    });

    res.redirect("/admin/hocvien");
  } catch (err) {
    console.error("❌ Lỗi postAddHocVien:", err);
    res.redirect("/admin/hocvien");
  }
};

// Cập nhật học viên
exports.postUpdateHocVien = async (req, res) => {
  try {
    const { id } = req.params;
    const { hoTen, ngaySinh, gioiTinh, soDienThoai, soZalo, diaChi } = req.body;

    const updateData = {
      hoTen,
      ngaySinh,
      gioiTinh,
      soDienThoai,
      soZalo,
      diaChi,
    };

    if (req.file) {
      updateData.anhDaiDien = `/uploads/${req.file.filename}`;
    }
    if (req.faceDescriptor) {
      updateData.faceDescriptor = Array.from(req.faceDescriptor);
    }

    await HocVien.findByIdAndUpdate(id, updateData);

    res.redirect("/admin/hocvien");
  } catch (err) {
    console.error("❌ Lỗi postUpdateHocVien:", err);
    res.redirect("/admin/hocvien");
  }
};

// Xóa học viên (xóa cả user liên kết)
exports.deleteHocVien = async (req, res) => {
  try {
    const hv = await HocVien.findById(req.params.id);
    if (hv) {
      // Xóa user
      await User.findByIdAndDelete(hv.MaTaiKhoan);
      // Xóa học viên
      await HocVien.findByIdAndDelete(req.params.id);
    }
    res.redirect("/admin/hocvien");
  } catch (err) {
    console.error("❌ Lỗi deleteHocVien:", err);
    res.redirect("/admin/hocvien");
  }
};
exports.dangKyKhoaHoc = async (req, res) => {
  try {
    const { soDienThoai } = req.body;
    const khoaHocId = req.params.id;

    // 1. tìm học viên
    const hv = await HocVien.findOne({ soDienThoai });
    if (!hv) {
      return res.status(400).send("❌ Học viên không tồn tại");
    }

    // 2. kiểm tra đã đăng ký chưa
    const daDK = await DangKyKhoaHoc.findOne({
      hocVien: hv._id,
      khoaHoc: khoaHocId,
      trangThai: { $ne: "Hủy" }
    });
    if (daDK) {
      return res.status(400).send("❌ Học viên đã đăng ký khóa học này");
    }

    // 3. tạo bản ghi đăng ký
    const dangKy = await DangKyKhoaHoc.create({
      hocVien: hv._id,
      khoaHoc: khoaHocId,
      trangThai: "Đang học"
    });

    // 4. lấy tất cả buổi học của khóa
    const dsBuoiHoc = await BuoiHoc.find({ khoaHoc: khoaHocId });

    // 5. tạo tham gia buổi học cho học viên này
    const thamGiaDocs = dsBuoiHoc.map(bh => ({
      hocVien: hv._id,
      buoiHoc: bh._id,
      trangThai: "chưa"
    }));

    if (thamGiaDocs.length > 0) {
      await ThamGiaBuoiHoc.insertMany(thamGiaDocs);
    }

    res.redirect(`/admin/khoahoc/${khoaHocId}`);
  } catch (err) {
    console.error("❌ Lỗi đăng ký:", err);
    res.redirect(`/admin/khoahoc/${req.params.id}`);
  }
};



exports.huyDangKy = async (req, res) => {
  try {
    const { dkId, khoaHocId } = req.params;

    // 1. Tìm đăng ký
    const dangKy = await DangKyKhoaHoc.findById(dkId);
    if (!dangKy) {
      return res.status(404).send("Đăng ký không tồn tại");
    }

    // 2. Cập nhật trạng thái đăng ký thành Hủy
    dangKy.trangThai = "Hủy";
    await dangKy.save();

    // 3. Lấy tất cả buổi học thuộc khóa này
    const dsBuoiHoc = await BuoiHoc.find({ khoaHoc: khoaHocId }).select("_id");

    // 4. Xóa tất cả tham gia buổi học của học viên này trong khóa học
    await ThamGiaBuoiHoc.deleteMany({
      hocVien: dangKy.hocVien,
      buoiHoc: { $in: dsBuoiHoc.map(b => b._id) }
    });

    res.redirect(`/admin/khoahoc/${khoaHocId}`);
  } catch (err) {
    console.error("❌ Lỗi hủy đăng ký:", err);
    res.redirect(`/admin/khoahoc/${req.params.khoaHocId}`);
  }
};



exports.searchHocVien = async (req, res) => {
  const { soDienThoai } = req.query;
  const hv = await HocVien.findOne({ soDienThoai }).lean();
  if (hv) res.json({ found: true, hocVien: hv });
  else res.json({ found: false });
}