// controllers/khoahocController.js
const KhoaHoc = require("../models/KhoaHoc");
const LoaiKhoaHoc = require("../models/LoaiKhoaHoc");
const PhongHoc = require("../models/PhongHoc");
const Lesson = require("../models/Lesson");
const BuoiHoc = require("../models/BuoiHoc");
const DangKyKhoaHoc = require("../models/DangKyKhoaHoc");
const GiangVien = require("../models/GiangVien");
const CoSo = require("../models/CoSo");

function nextDateForWeekday(fromDate, targetWeekday) {
  // từ fromDate (Date) tìm ngày tiếp theo có day == targetWeekday (0=CN,...6=Thứ 7)
  const d = new Date(fromDate);
  // reset time to 00:00:00 để so sánh ngày
  d.setHours(0,0,0,0);
  let add = (targetWeekday - d.getDay() + 7) % 7;
  if (add === 0) return d; // nếu cùng thứ, trả luôn ngày đó
  d.setDate(d.getDate() + add);
  return d;
}

exports.getAllKhoaHoc = async (req, res) => {
  try {
    const DSKhoaHoc = await KhoaHoc.find()
      .populate("loaiKhoaHoc")
      .populate("giangVien") // mảng GiangVien
      .lean();

    for (let kh of DSKhoaHoc) {
      const count = await DangKyKhoaHoc.countDocuments({ khoaHoc: kh._id });
      kh.soLuongDangKy = count;

      const now = new Date();
      if (kh.thoiGianBatDau && now < kh.thoiGianBatDau) {
        kh.trangThaiThucTe = "Chưa bắt đầu";
      } else if (kh.thoiGianKetThuc && now > kh.thoiGianKetThuc) {
        kh.trangThaiThucTe = "Đã kết thúc";
      } else {
        kh.trangThaiThucTe = "Đang diễn ra";
      }
    }

    res.render("admin/khoahoc", {
      layout: "layouts/main",
      title: "Quản lý Khóa Học",
      user: req.user,
      DSKhoaHoc
    });
  } catch (err) {
    console.error("Lỗi getAllKhoaHoc:", err);
    res.redirect("/admin");
  }
};

exports.getAddKhoaHoc = async (req, res) => {
  try {
    const DSLoai = await LoaiKhoaHoc.find().lean();
    // lấy danh sách giảng viên từ model GiangVien
    const DSGiangVien = await GiangVien.find()
      .populate("MaTaiKhoan", "email username")
      .lean();
    const DSCoso = await CoSo.find().lean();

    res.render("admin/khoahoc_add", {
      layout: "layouts/main",
      title: "Thêm Khóa Học",
      user: req.user,
      DSLoai,
      DSGiangVien,
      DSCoso
    });
  } catch (err) {
    console.error("Lỗi getAddKhoaHoc:", err);
    res.redirect("/admin/khoahoc");
  }
};

exports.getPhongByCoSo = async (req, res) => {
  try {
    const { coSoId } = req.params;
    const DSPhong = await PhongHoc.find({ coSo: coSoId }).lean();
    res.json(DSPhong);
  } catch (err) {
    console.error("Lỗi getPhongByCoSo:", err);
    res.json([]);
  }
};

exports.postAddKhoaHoc = async (req, res) => {
  try {
    // Expectation from client:
    // tenKhoaHoc, loaiKhoaHoc, coSo, phongHoc, giangVien (string or array of ids),
    // lichHocJson (stringified JSON array: [{thu: 1, gioBatDau: "18:00", gioKetThuc: "20:00"}, ...])
    const { tenKhoaHoc, loaiKhoaHoc, coSo, giangVien, phongHoc, lichHocJson } = req.body;

    if (!tenKhoaHoc || !loaiKhoaHoc || !coSo || !phongHoc) {
      throw new Error("Thiếu trường bắt buộc");
    }

    // 1) Tạo tên khóa học cuối cùng = tenKhoaHoc + số (số khóa có cùng loại + cơ sở)
    const countSame = await KhoaHoc.countDocuments({ loaiKhoaHoc, coSo });
    const tenFinal = `${tenKhoaHoc} ${countSame + 1}`;

    // 2) Lấy phòng học để gán số lượng tối đa
    const phong = await PhongHoc.findById(phongHoc);
    if (!phong) throw new Error("Phòng học không tồn tại");
    const soLuongToiDa = phong.sucChua || 0;

    // 3) xử lý giảng viên: cho phép 1 hoặc nhiều
    let gvArray = [];
    if (Array.isArray(giangVien)) gvArray = giangVien;
    else if (typeof giangVien === "string" && giangVien.trim() !== "") gvArray = [giangVien];
    // optional: validate tồn tại các GiangVien
    if (gvArray.length > 0) {
      const existCount = await GiangVien.countDocuments({ _id: { $in: gvArray } });
      if (existCount !== gvArray.length) {
        console.warn("Có giảng viên không tồn tại, sẽ bỏ qua những id sai.");
        // lọc chỉ id tồn tại
        const existGVs = await GiangVien.find({ _id: { $in: gvArray } }).distinct("_id");
        gvArray = existGVs.map(String);
      }
    }

    // 4) Tạo KhoaHoc (chưa set thoiGianBatDau/ KetThuc)
    const khoaHoc = await KhoaHoc.create({
      tenKhoaHoc: tenFinal,
      loaiKhoaHoc,
      coSo,
      giangVien: gvArray,
      phongHoc,
      soLuongToiDa
    });

    // 5) Lấy số lesson của loại khóa học (dùng field LoaikhoaHoc trong Lesson model)
    const lessons = await Lesson.find({ LoaikhoaHoc: loaiKhoaHoc }).sort({ _id: 1 }).lean();
    const soBaiHoc = lessons.length;

    // 6) Parse lichHoc từ client (JSON)
    let lichHoc = [];
    if (lichHocJson) {
      try {
        const parsed = JSON.parse(lichHocJson);
        if (Array.isArray(parsed)) {
          // each item expected {thu: <0..6>, gioBatDau: "HH:MM", gioKetThuc: "HH:MM"}
          lichHoc = parsed.map(item => ({
            thu: String(item.thu),
            gioBatDau: item.gioBatDau,
            gioKetThuc: item.gioKetThuc
          }));
        }
      } catch (e) {
        console.warn("lichHocJson parse failed:", e);
      }
    }

    // 7) Tạo BuoiHoc theo lichHoc đến khi đủ số bài học
    let buoiHocDaTao = 0;
    let firstBuoiDate = null;
    let lastBuoiDate = null;

    if (lichHoc.length > 0 && soBaiHoc > 0) {
      // ✅ lưu lịch mặc định vào khóa học
      khoaHoc.lichHoc = lichHoc;

      let ngayPointer = new Date();
      ngayPointer.setHours(0, 0, 0, 0);

      while (buoiHocDaTao < soBaiHoc) {
        for (let lh of lichHoc) {
          if (buoiHocDaTao >= soBaiHoc) break;

          const targetThu = parseInt(lh.thu, 10);

          // tìm ngày tiếp theo trùng thứ
          const ngayHocDate = new Date(ngayPointer);
          while (ngayHocDate.getDay() !== targetThu) {
            ngayHocDate.setDate(ngayHocDate.getDate() + 1);
          }

          // ✅ gán lesson theo thứ tự
          const lesson = lessons[buoiHocDaTao];

          // tạo BuoiHoc
          await BuoiHoc.create({
            khoaHoc: khoaHoc._id,
            lesson: lesson._id, // gán lesson theo thứ tự
            phongHoc: phongHoc,
            ngayHoc: new Date(ngayHocDate),
            gioBatDau: lh.gioBatDau,
            gioKetThuc: lh.gioKetThuc
          });

          // cập nhật thời gian bắt đầu/kết thúc
          if (!firstBuoiDate || ngayHocDate < firstBuoiDate) {
            firstBuoiDate = new Date(ngayHocDate);
          }
          if (!lastBuoiDate || ngayHocDate > lastBuoiDate) {
            lastBuoiDate = new Date(ngayHocDate);
          }

          buoiHocDaTao++;

          // sang ngày tiếp theo để tránh lặp lại
          ngayPointer.setTime(ngayHocDate.getTime());
          ngayPointer.setDate(ngayPointer.getDate() + 1);
        }
      }
    }

    // 8) cập nhật thời gian bắt đầu/kết thúc vào khóa học
    if (firstBuoiDate) {
      khoaHoc.thoiGianBatDau = firstBuoiDate;
    }
    if (lastBuoiDate) {
      khoaHoc.thoiGianKetThuc = lastBuoiDate;
    }

    await khoaHoc.save();

    res.redirect("/admin/khoahoc");
  } catch (err) {
    console.error("Lỗi tạo khóa học:", err);
    // bạn có thể set flash message để báo lỗi
    res.redirect("/admin/khoahoc");
  }
};

exports.deleteKhoaHoc = async (req, res) => {
  try {
    await KhoaHoc.findByIdAndDelete(req.params.id);
    res.redirect("/admin/khoahoc");
  } catch (err) {
    console.error("Lỗi deleteKhoaHoc:", err);
    res.redirect("/admin/khoahoc");
  }
};

exports.getChiTietKhoaHoc = async (req, res) => {
  try {
    const id = req.params.id;
    const khoaHoc = await KhoaHoc.findById(id)
      .populate("loaiKhoaHoc")
      .populate("giangVien")
      .populate({
        path: "phongHoc",
        populate: { path: "coSo" }   // ✅ lấy luôn coSo từ PhongHoc
      })
      .lean();

    if (!khoaHoc) return res.redirect("/admin/khoahoc");

    const dsBuoi = await BuoiHoc.find({ khoaHoc: id })
      .populate("lesson")
      .sort({ ngayHoc: 1, gioBatDau: 1 })
      .lean();

    const DSGiangVien = await GiangVien.find()
      .populate("MaTaiKhoan", "email username")
      .lean();

    res.render("admin/khoahoc_detail", {
      layout: "layouts/main",
      title: "Chi tiết Khóa Học",
      user: req.user,
      khoaHoc,
      dsBuoi,
      DSGiangVien
    });
  } catch (err) {
    console.error("Lỗi getChiTietKhoaHoc:", err);
    res.redirect("/admin/khoahoc");
  }
};


  // Cập nhật thông tin khóa học (chỉ tên, trạng thái, giảng viên)
  exports.postUpdateKhoaHoc = async (req, res) => {
    try {
      const { id } = req.params;
      const { tenKhoaHoc, trangThai, giangVien } = req.body;

      // đảm bảo giảng viên là mảng
      let gvArray = [];
      if (Array.isArray(giangVien)) {
        gvArray = giangVien;
      } else if (typeof giangVien === "string" && giangVien.trim() !== "") {
        gvArray = [giangVien];
      }

      await KhoaHoc.findByIdAndUpdate(id, {
        tenKhoaHoc,
        trangThai,
        giangVien: gvArray
      });

      // redirect về trang chi tiết
      res.redirect(`/admin/khoahoc/${id}`);
    } catch (err) {
      console.error("Lỗi postUpdateKhoaHoc:", err);
      res.redirect("/admin/khoahoc");
    }
  };

  // Xóa một buổi học và lùi lesson
  exports.deleteBuoiHoc = async (req, res) => {
    try {
      const { khoaHocId, buoiId } = req.params;

      // lấy tất cả buổi học của khóa học
      const dsBuoi = await BuoiHoc.find({ khoaHoc: khoaHocId }).sort({ ngayHoc: 1 }).exec();

      // tìm buổi bị xóa
      const index = dsBuoi.findIndex(b => b._id.toString() === buoiId);
      if (index === -1) return res.redirect(`/admin/khoahoc/${khoaHocId}`);

      // xóa buổi học
      await BuoiHoc.findByIdAndDelete(buoiId);

      // lùi lesson cho các buổi sau
      for (let i = index + 1; i < dsBuoi.length; i++) {
        const buoiTruoc = dsBuoi[i - 1];
        const buoiSau = dsBuoi[i];
        await BuoiHoc.findByIdAndUpdate(buoiSau._id, {
          lesson: buoiTruoc.lesson
        });
      }

      // tạo buổi học mới ở cuối với lesson cuối cùng
      const khoaHoc = await KhoaHoc.findById(khoaHocId).lean();
      const lastBuoi = await BuoiHoc.findOne({ khoaHoc: khoaHocId }).sort({ ngayHoc: -1 }).lean();

      // lấy lesson cuối cùng (theo số lượng lesson trong loại khóa học)
      const lessons = await Lesson.find({ LoaikhoaHoc: khoaHoc.loaiKhoaHoc }).sort({ _id: 1 }).lean();
      const lessonCuoi = lessons[lessons.length - 1];

      if (lastBuoi) {
        const ngayMoi = new Date(lastBuoi.ngayHoc);
        ngayMoi.setDate(ngayMoi.getDate() + 7); // tạm: tạo 1 tuần sau buổi cuối

        await BuoiHoc.create({
          khoaHoc: khoaHocId,
          lesson: lessonCuoi._id,
          phongHoc: khoaHoc.phongHoc,
          ngayHoc: ngayMoi,
          gioBatDau: lastBuoi.gioBatDau,
          gioKetThuc: lastBuoi.gioKetThuc
        });
      }

      res.redirect(`/admin/khoahoc/${khoaHocId}`);
    } catch (err) {
      console.error("Lỗi deleteBuoiHoc:", err);
      res.redirect("/admin/khoahoc");
    }
  };