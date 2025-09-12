const HocVien = require("../models/HocVien");

exports.getProfile = async (req, res) => {
    try {
        const hocVien = await HocVien.findById(req.params.id).lean();
        res.render("hocvien/profile", { hocVien });
    } catch (error) {
        res.status(500).send("Lỗi server: " + error.message);
    }
};