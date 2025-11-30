const ThamGiaBuoiHoc = require("../../models/ThamGiaBuoiHoc");

exports.getLichHocCaNhan = async (req, res) => {
  try {
    // Lấy ID học viên từ user đã đăng nhập
    const hocVienId = req.user._id;

    const thamGia = await ThamGiaBuoiHoc.find({ hocVien: hocVienId })
      .populate({
        path: "buoiHoc",
        populate: [
          { path: "khoaHoc" },
          { 
            path: "phongHoc",
            populate: { path: "coSo" }
          },
          { path: "lesson" }
        ]
      })
      .lean();

    const events = thamGia.map(item => {
      const bh = item.buoiHoc;
      if (!bh) return null;

      // YYYY-MM-DD
      const date = bh.ngayHoc.toISOString().split("T")[0];

      return {
        title: `${bh.khoaHoc?.tenKhoaHoc || "Không tên"} | ${bh.phongHoc?.tenPhong || ""}`,
        start: `${date}T${bh.gioBatDau}`,
        end: `${date}T${bh.gioKetThuc}`,
        
        extendedProps: {
          phong: bh.phongHoc?.tenPhong,
          coSo: bh.phongHoc?.coSo?.tenCoSo,
          lesson: bh.lesson?.tenLesson,
          trangThaiThamGia: item.trangThai,
          anhChup: item.anhChup,
          ngayDiemDanh: item.ngayDiemDanh
        }
      };
    }).filter(e => e !== null);

    res.render("hocvien/lichhoc", { events, user: req.user, layout: "layouts/hocvien_main", title: "Lịch học cá nhân" });

  } catch (err) {
    console.error(err);
    res.status(500).send("Lỗi khi tải lịch học cá nhân");
  }
};
