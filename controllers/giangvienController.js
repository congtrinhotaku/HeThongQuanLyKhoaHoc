const GiangVien = require("../models/GiangVien");
const User = require("../models/User");

// Danh sách giảng viên
exports.getAllGiangVien = async (req, res) => {
  try {
    const DSGiangVien = await GiangVien.find().populate("MaTaiKhoan").lean();
    res.render("admin/giangvien", {
      layout: "layouts/main",
      title: "Quản lý Giảng viên",
      user: req.user,
      DSGiangVien
    });
  } catch (err) {
    console.error("Lỗi getAllGiangVien:", err);
    res.redirect("/admin");
  }
};

// Thêm giảng viên + tự tạo tài khoản
exports.postAddGiangVien = async (req, res) => {
  try {
    const { hoTen, ngaySinh, gioiTinh, email, soDienThoai, soZalo, diaChi, diemToeic, diemIelts } = req.body;

    // Sinh mật khẩu mặc định: chữ cuối họ tên không dấu + 4 số cuối SĐT
    let matKhauMacDinh = "123456";
    if (hoTen && soDienThoai) {
      const lastName = hoTen.trim().split(" ").slice(-1)[0].normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      const fourDigits = soDienThoai.slice(-4);
      matKhauMacDinh = lastName.toLowerCase() + fourDigits;
    }

    // Tạo tài khoản User
    const user = await User.create({
      username: hoTen,
      email,
      password: matKhauMacDinh,
      role: "teacher"
    });

    // Tạo hồ sơ giảng viên
    await GiangVien.create({
      MaTaiKhoan: user._id,
      hoTen,
      ngaySinh,
      gioiTinh,
      email,
      soDienThoai,
      soZalo,
      diaChi,
      diemToeic,
      diemIelts
    });

    res.redirect("/admin/giangvien");
  } catch (err) {
    console.error("Lỗi postAddGiangVien:", err);
    res.redirect("/admin/giangvien");
  }
};

// Sửa giảng viên
exports.postEditGiangVien = async (req, res) => {
  try {
    const { id } = req.params;
    const { hoTen, ngaySinh, gioiTinh, email, soDienThoai, soZalo, diaChi, diemToeic, diemIelts } = req.body;

    await GiangVien.findByIdAndUpdate(id, {
      hoTen,
      ngaySinh,
      gioiTinh,
      email,
      soDienThoai,
      soZalo,
      diaChi,
      diemToeic,
      diemIelts
    });

    res.redirect("/admin/giangvien");
  } catch (err) {
    console.error("Lỗi postEditGiangVien:", err);
    res.redirect("/admin/giangvien");
  }
};

// Xóa giảng viên + xóa tài khoản liên kết
exports.postDeleteGiangVien = async (req, res) => {
  try {
    const { id } = req.params;
    const gv = await GiangVien.findById(id);

    if (gv) {
      await User.findByIdAndDelete(gv.MaTaiKhoan);
      await GiangVien.findByIdAndDelete(id);
    }

    res.redirect("/admin/giangvien");
  } catch (err) {
    console.error("Lỗi postDeleteGiangVien:", err);
    res.redirect("/admin/giangvien");
  }
};
