// controllers/giangvien/baiTapController.js
const GiangVien = require("../../models/GiangVien");
const KhoaHoc = require("../../models/KhoaHoc");
const mongoose = require("mongoose");
const BaiTap = require("../../models/BaiTap");
const upload = require("../../middlewares/multer");


exports.getKhoaHoc = async (req, res) => {
    try {
        console.log("UserID:", req.user._id);

        // Tìm giảng viên theo tài khoản
        const gv = await GiangVien.findOne({ MaTaiKhoan: req.user._id }).lean();
        if (!gv) {
            return res.status(404).send("Không tìm thấy giảng viên");
        }

        // Lấy danh sách khóa học mà giảng viên này dạy
        const dsKhoaHoc = await KhoaHoc.find({ giangVien: gv._id }).lean();

        res.render("giangvien/baitap_chon_khoahoc", {
            layout: "layouts/teacher_layout",
            title: "Quản lý bài tập - Chọn khóa học",
            user: req.user,
            gv,
            dsKhoaHoc,
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("Lỗi server");
    }
};
// Hiển thị danh sách bài tập của một khóa học
exports.listByCourse = async (req, res) => {
    try {
        const { idKhoaHoc } = req.params;
        const khoaHoc = await KhoaHoc.findById(idKhoaHoc).lean();
        if (!khoaHoc) return res.status(404).send("Không tìm thấy khóa học");

        const dsBaiTap = await BaiTap.find({ khoaHoc: idKhoaHoc }).lean();

        res.render("giangvien/baitap_list", {
            layout: "layouts/teacher_layout",
            title: `Danh sách bài tập - ${khoaHoc.tenKhoaHoc}`,
            user: req.user,
            khoaHoc,
            dsBaiTap,
        });
    } catch (err) {
        console.error("❌ Lỗi listByCourse:", err);
        res.status(500).send("Lỗi server");
    }
};

// Hiển thị form thêm bài tập
exports.showAddForm = async (req, res) => {
    try {
        const { idKhoaHoc } = req.params;
        const khoaHoc = await KhoaHoc.findById(idKhoaHoc).lean();
        if (!khoaHoc) return res.status(404).send("Không tìm thấy khóa học");

        res.render("giangvien/baitap_add", {
            layout: "layouts/teacher_layout",
            title: "Thêm bài tập",
            user: req.user,
            khoaHoc,
        });
    } catch (err) {
        console.error("❌ Lỗi showAddForm:", err);
        res.status(500).send("Lỗi server");
    }
};

// Xử lý thêm bài tập
exports.addBaiTap = async (req, res) => {
    try {
        const { idKhoaHoc } = req.params;

        const baiTap = new BaiTap({
            khoaHoc: idKhoaHoc,
            tieuDe: req.body.tieuDe,
            noiDung: req.body.noiDung,
            hanNop: req.body.hanNop,
            fileDinhKem: req.file ? `/uploads/${req.file.filename}` : null,
        });

        await baiTap.save();
        res.redirect(`/giangvien/baitap/khoa/${idKhoaHoc}`);
    } catch (err) {
        console.error("❌ Lỗi addBaiTap:", err);
        res.status(500).send("Lỗi server");
    }
};
exports.updateBaiTap = async (req, res) => {
    try {
        const { idKhoaHoc, idBaiTap } = req.params;
        const updateData = {
            tieuDe: req.body.tieuDe,
            noiDung: req.body.noiDung,
            hanNop: req.body.hanNop || null,
        };
        if (req.file) updateData.fileDinhKem = `/uploads/${req.file.filename}`;
        await BaiTap.findByIdAndUpdate(idBaiTap, updateData);
        res.redirect(`/giangvien/baitap/khoa/${idKhoaHoc}`);
    } catch (err) {
        console.error(err);
        res.status(500).send("Lỗi server");
    }
};

exports.deleteBaiTap = async (req, res) => {
    try {
        const { idKhoaHoc, idBaiTap } = req.params;
        await BaiTap.findByIdAndDelete(idBaiTap);
        res.redirect(`/giangvien/baitap/khoa/${idKhoaHoc}`);
    } catch (err) {
        console.error(err);
        res.status(500).send("Lỗi server");
    }
};