const HocVien = require("../../models/HocVien");

exports.getProfile = async (req, res) => {
    try {
        const hv = await HocVien.findOne({ MaTaiKhoan: req.user._id }).lean();

        res.render("hocvien/profile", {
            layout: "layouts/hocvien_main",
            title: "Thông tin cá nhân",
            user: req.user,
            hv
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("Lỗi server");
    }
};