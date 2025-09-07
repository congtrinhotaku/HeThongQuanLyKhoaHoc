const User = require("../../models/User");
const bcrypt = require("bcrypt");

// Danh sách user
exports.getAllUsers = async (req, res) => {
  const DSUser = await User.find().lean();
  res.render("admin/user", {
    layout: "layouts/main",
    title: "Quản lý Tài khoản",
    user: req.user,
    DSUser
  });
};

// Thêm user
exports.addUser = async (req, res) => {
  const { username, email, password, role } = req.body;
  await User.create({ username, email, password, role });
  res.redirect("/admin/user");
};

// Xóa user
exports.deleteUser = async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.redirect("/admin/user");
};

// Đổi mật khẩu
exports.changePassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { newPassword } = req.body;

    const hashed = await bcrypt.hash(newPassword, 10);
    await User.findByIdAndUpdate(id, { password: hashed });

    res.redirect("/admin/user");
  } catch (err) {
    console.error("Lỗi đổi mật khẩu:", err);
    res.status(500).send("Có lỗi xảy ra khi đổi mật khẩu");
  }
};
