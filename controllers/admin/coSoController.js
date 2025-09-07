const CoSo = require("../../models/CoSo");
const PhongHoc = require("../../models/PhongHoc");

// Danh sách cơ sở
exports.getAllCoSo = async (req, res) => {
  const DSCoso = await CoSo.find().lean();
  res.render("admin/coso", {
    layout: "layouts/main",
    title: "Quản lý Cơ Sở",
    user: req.user,
    DSCoso
  });
};


// Trang chi tiết + CRUD phòng học
exports.getDetailCoSo = async (req, res) => {
  const cs = await CoSo.findById(req.params.id).lean();
  if (!cs) return res.status(404).send("Không tìm thấy cơ sở");

  const phongHocs = await PhongHoc.find({ coSo: cs._id }).lean();

  res.render("admin/coso_detail", {
    layout: "layouts/main",
    title: "Chi tiết Cơ Sở",
    user: req.user,
    cs,
    phongHocs
  });
};

// Cập nhật thông tin cơ sở
exports.updateCoSo = async (req, res) => {
  const { tenCoSo, diaChi, soDienThoai } = req.body;
  await CoSo.findByIdAndUpdate(req.params.id, { tenCoSo, diaChi, soDienThoai });
  res.redirect(`/admin/coso/${req.params.id}`);
};

// Thêm cơ sở
exports.addCoSo = async (req, res) => {
  try {
    const { tenCoSo, diaChi, soDienThoai } = req.body;
    await CoSo.create({ tenCoSo, diaChi, soDienThoai });
    res.redirect("/admin/coso");
  } catch (err) {
    res.status(500).send("Không thể thêm cơ sở");
  }
};

// Xóa cơ sở
exports.deleteCoSo = async (req, res) => {
  await CoSo.findByIdAndDelete(req.params.id);
  res.redirect("/admin/coso");
};

// ------------------- CRUD phòng học theo cơ sở -------------------
exports.addPhongHoc = async (req, res) => {
  const { tenPhong, sucChua } = req.body;
  await PhongHoc.create({ tenPhong, sucChua, coSo: req.params.id });
  res.redirect(`/admin/coso/${req.params.id}`);
};

exports.updatePhongHoc = async (req, res) => {
  const { tenPhong, sucChua } = req.body;
  await PhongHoc.findByIdAndUpdate(req.params.phongId, { tenPhong, sucChua });
  res.redirect(`/admin/coso/${req.params.id}`);
};

exports.deletePhongHoc = async (req, res) => {
  await PhongHoc.findByIdAndDelete(req.params.phongId);
  res.redirect(`/admin/coso/${req.params.id}`);
};
