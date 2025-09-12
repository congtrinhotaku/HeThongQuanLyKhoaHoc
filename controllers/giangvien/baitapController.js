const BaiTap = require("../../models/BaiTap");
const BuoiHoc = require("../../models/BuoiHoc");

// Danh sách bài tập
exports.getAllBaiTap = async (req, res) => {
    const dsBaiTap = await BaiTap.find().populate("buoi").lean();

    res.render("admin/baitap", {
        layout: "layouts/main",
        title: "Quản lý Bài Tập",
        user: req.user,
        dsBaiTap
    });
};

// Trang chi tiết bài tập
exports.getDetailBaiTap = async (req, res) => {
    const baiTap = await BaiTap.findById(req.params.id)
        .populate("buoi")
        .lean();

    if (!baiTap) return res.status(404).send("Không tìm thấy bài tập");

    res.render("admin/baitap_detail", {
        layout: "layouts/teacher_layout",
        title: "Chi tiết Bài Tập",
        user: req.user,
        baiTap
    });
};

// Thêm bài tập
exports.addBaiTap = async (req, res) => {
    try {
        const { tenBaiTap, moTa, buoi } = req.body;
        await BaiTap.create({ tenBaiTap, moTa, buoi });
        res.redirect("/admin/baitap");
    } catch (err) {
        console.error(err);
        res.status(500).send("Không thể thêm bài tập");
    }
};

// Cập nhật bài tập
exports.updateBaiTap = async (req, res) => {
    const { tenBaiTap, moTa, buoi } = req.body;
    await BaiTap.findByIdAndUpdate(req.params.id, { tenBaiTap, moTa, buoi });
    res.redirect(`/admin/baitap/${req.params.id}`);
};

// Xóa bài tập
exports.deleteBaiTap = async (req, res) => {
    await BaiTap.findByIdAndDelete(req.params.id);
    res.redirect("/admin/baitap");
};
