const NghiPhepHocBu = require("../../models/NghiPhepHocBu");

exports.getDanhSachDonNghi = async (req, res) => {
  try {
    const dsDon = await NghiPhepHocBu.find()
      .populate("hocVien", "hoTen email")
      .populate({
        path: "buoiHoc",
        populate: { path: "khoaHoc", select: "tenKhoaHoc" }
      })
      .lean();

    res.render("admin/nghiphep", {
      layout: "layouts/main",
      title: "Duyệt đơn xin nghỉ",
      user: req.user,
      dsDon,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Lỗi server");
  }
};

exports.postDuyetDon = async (req, res) => {
  try {
    await NghiPhepHocBu.findByIdAndUpdate(req.params.id, { trangThai: "Duyệt" });
    res.redirect("/admin/nghiphep");
  } catch (err) {
    console.error(err);
    res.status(500).send("Không thể duyệt đơn");
  }
};

exports.postTuChoiDon = async (req, res) => {
  try {
    await NghiPhepHocBu.findByIdAndUpdate(req.params.id, { trangThai: "Từ chối" });
    res.redirect("/admin/nghiphep");
  } catch (err) {
    console.error(err);
    res.status(500).send("Không thể từ chối đơn");
  }
};
