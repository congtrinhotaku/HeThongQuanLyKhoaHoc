const HocVien = require("../../models/HocVien");
const NghiPhepHocBu = require("../../models/NghiPhepHocBu");
const DangKyKhoaHoc = require("../../models/DangKyKhoaHoc");
const BuoiHoc = require("../../models/BuoiHoc");

exports.getProfile = async (req, res) => {
    try {
        // Sử dụng req.session.user để nhất quán với các controller khác
        const hv = await HocVien.findOne({ MaTaiKhoan: req.session.user._id }).lean();

        let dsDangKy = [];
        // Chỉ tìm các khóa học đã đăng ký nếu thông tin học viên tồn tại
        if (hv) {
            dsDangKy = await DangKyKhoaHoc.find({ hocVien: hv._id })
                .populate("khoaHoc") // Lấy toàn bộ thông tin khóa học
                .lean();

            // Tính toán trạng thái thực tế cho mỗi khóa học
            const now = new Date();
            for (const dk of dsDangKy) {
                if (dk.khoaHoc) {
                    if (dk.khoaHoc.thoiGianBatDau && now < dk.khoaHoc.thoiGianBatDau) {
                        dk.khoaHoc.trangThaiThucTe = "Chưa bắt đầu";
                    } else if (dk.khoaHoc.thoiGianKetThuc && now > dk.khoaHoc.thoiGianKetThuc) {
                        dk.khoaHoc.trangThaiThucTe = "Đã kết thúc";
                    } else {
                        dk.khoaHoc.trangThaiThucTe = "Đang diễn ra";
                    }
                }
            }
        }

        res.render("hocvien/profile", {
            layout: "layouts/hocvien_main",
            title: "Thông tin cá nhân",
            dsDangKy: dsDangKy,
            user: req.session.user, // Sử dụng req.session.user
            hv
        });
    } catch (err) {
        console.error("Lỗi khi lấy thông tin cá nhân:", err);
        res.status(500).send("Lỗi server");
    }
};

exports.postUpdateHocVien = async (req, res) => {
  try {
    const { id } = req.params;
    const { hoTen, ngaySinh, gioiTinh, email, soDienThoai, soZalo, diaChi } = req.body;

    await HocVien.findByIdAndUpdate(id, {
      hoTen,
      ngaySinh,
      gioiTinh,
      email,
      soDienThoai,
      soZalo,
      diaChi
    });

    res.redirect("/hocvien/profile"); // load lại
  } catch (err) {
    console.error("❌ Lỗi postUpdateHocVien:", err);
    res.redirect("/hocvien/profile");
  }
};

// Hiển thị form chọn khóa học
exports.getNghiHoc = async (req, res) => {
  try {
    // Lấy học viên theo user đang đăng nhập
    const hv = await HocVien.findOne({ MaTaiKhoan: req.session.userId });

    // Lấy danh sách khóa học mà học viên đã đăng ký
    const dsKhoaHoc = await DangKyKhoaHoc.find({ hocVien: hv._id })
      .populate("khoaHoc", "tenKhoaHoc")
      .lean();

    // Lấy danh sách đơn xin nghỉ của học viên
    const dsNghiPhep = await NghiPhepHocBu.find({ hocVien: hv._id })
      .populate({
        path: "buoiHoc",
        populate: { path: "khoaHoc", select: "tenKhoaHoc" }
      })
      .lean();

    res.render("hocvien/xinnghi_chon_khoahoc", {
      layout: "layouts/hocvien_main",
      title: "Xin nghỉ học",
      user: req.user,
      dsKhoaHoc,
      dsNghiPhep
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Lỗi server");
  }
};


// Hiển thị các buổi học chưa đến của khóa học
exports.getBuoiHocTheoKhoa = async (req, res) => {
  try {
    const { khoaHocId } = req.params;
    const now = new Date();

    const dsBuoiHoc = await BuoiHoc.find({ 
        khoaHoc: khoaHocId, 
        ngayHoc: { $gte: now }   // chỉ lấy buổi học từ hiện tại trở đi
      })
      .sort("ngayHoc")
      .lean();

    res.render("hocvien/xinnghi_chon_buoihoc", {
      layout: "layouts/hocvien_main",
      title: "Chọn buổi học để xin nghỉ",
      user: req.user,
      dsBuoiHoc,
      khoaHocId
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Lỗi server");
  }
};

// Nộp đơn xin nghỉ
exports.postXinNghi = async (req, res) => {
  try {
    const hv = await HocVien.findOne({ MaTaiKhoan: req.user._id });
    const { buoiHoc, lyDo } = req.body;
    const file = req.file ? `/uploads/${req.file.filename}` : null;

    const donNghi = new NghiPhepHocBu({
      hocVien: hv._id,
      buoiHoc,
      lyDo,
      fileMinhChung: file
    });

    await donNghi.save();
    res.redirect("/hocvien/xinnghi");
  } catch (err) {
    console.error(err);
    res.status(500).send("Không thể tạo đơn xin nghỉ");
  }
};

// Xem danh sách đơn đã gửi
exports.getDanhSachXinNghi = async (req, res) => {
  try {
    const hv = await HocVien.findOne({ MaTaiKhoan: req.user._id });
    const dsNghiPhep = await NghiPhepHocBu.find({ hocVien: hv._id })
      .populate({
        path: "buoiHoc",
        populate: { path: "khoaHoc", select: "tenKhoaHoc" }
      })
      .lean();

    res.render("hocvien/xinnghi_danhsach", {
      layout: "layouts/hocvien_main",
      title: "Đơn xin nghỉ phép đã gửi",
      user: req.user,
      dsNghiPhep
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Lỗi server");
  }
};