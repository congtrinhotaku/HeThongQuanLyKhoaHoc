const CoSo = require("../models/CoSo");

// Hiển thị danh sách cơ sở
exports.getAllCoSo = async (req, res) => {
  try {
    const cosos = await CoSo.find().lean();
    res.render("admin/coso", {
      title: "Quản lý Cơ Sở",
      user: req.user,
      cosos
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Lỗi server");
  }
};

// Thêm cơ sở mới
exports.addCoSo = async (req, res) => {
  try {
    const { tenCoSo, diaChi, soDienThoai } = req.body;
    await CoSo.create({ tenCoSo, diaChi, soDienThoai });
    res.redirect("/admin/coso");
  } catch (err) {
    console.error(err);
    res.status(500).send("Không thể thêm cơ sở");
  }
};

// Sửa cơ sở
exports.editCoSo = async (req, res) => {
  try {
    const { id } = req.params;
    const { tenCoSo, diaChi, soDienThoai } = req.body;
    await CoSo.findByIdAndUpdate(id, { tenCoSo, diaChi, soDienThoai });
    res.redirect("/admin/coso");
  } catch (err) {
    console.error(err);
    res.status(500).send("Không thể sửa cơ sở");
  }
};

// Xóa cơ sở
exports.deleteCoSo = async (req, res) => {
  try {
    const { id } = req.params;
    await CoSo.findByIdAndDelete(id);
    res.redirect("/admin/coso");
  } catch (err) {
    console.error(err);
    res.status(500).send("Không thể xóa cơ sở");
  }
};
