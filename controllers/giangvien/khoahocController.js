const KhoaHoc = require("../../models/KhoaHoc");
const BuoiHoc = require("../../models/BuoiHoc");

exports.getChiTietKhoaHoc = async (req, res) => {
    try {
        const khoaHocId = req.params.id;

        // Lấy thông tin khóa học
        const khoaHoc = await KhoaHoc.findById(khoaHocId).lean();
        if (!khoaHoc) {
            return res.status(404).send("Không tìm thấy khóa học");
        }

        // Lấy danh sách buổi học theo khóa học
        const dsBuoiHoc = await BuoiHoc.find({ khoaHoc: khoaHocId })
            .populate("lesson")
            .populate("phongHoc")
            .lean();

        res.render("giangvien/chitietkhoahoc", {
            layout: "layouts/teacher_layout",
            title: "Chi tiết khóa học",
            user: req.user,
            khoaHoc,
            dsBuoiHoc,
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("Có lỗi xảy ra");
    }
};
