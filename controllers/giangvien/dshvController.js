const KhoaHoc = require("../../models/KhoaHoc");
const DangKyKhoaHoc = require("../../models/DangKyKhoaHoc"); // bảng trung gian học viên - khóa học
const GiangVien = require("../../models/GiangVien");
const HocVien = require("../../models/HocVien");

// B1: Giảng viên chọn khóa học

exports.getKhoaHocForHocVien = async (req, res) => {
    try {
        console.log("UserID:", req.user._id);

        // Lấy giảng viên theo tài khoản
        const gv = await GiangVien.findOne({ MaTaiKhoan: req.user._id }).lean();
        if (!gv) {
            return res.status(404).send("Không tìm thấy giảng viên");
        }

        // Lấy danh sách khóa học mà giảng viên này dạy
        const dsKhoaHoc = await KhoaHoc.find({ giangVien: gv._id }).lean();

        res.render("giangvien/dshv_chon_khoahoc", {
            layout: "layouts/teacher_layout",
            title: "DSHV",
            user: req.user,
            gv,
            dsKhoaHoc
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("Lỗi server");
    }
};
exports.getHocVienByKhoaHoc = async (req, res) => {
    try {
        const { idKhoaHoc } = req.params;

        // Kiểm tra khóa học
        const khoaHoc = await KhoaHoc.findById(idKhoaHoc).lean();
        if (!khoaHoc) return res.status(404).send("Không tìm thấy khóa học");

        // Lấy danh sách học viên đăng ký khóa học này
        const dsDangKy = await DangKyKhoaHoc.find({ khoaHoc: idKhoaHoc })
            .populate("hocVien")
            .lean();

        const dsHocVien = dsDangKy.map(dk => dk.hocVien);

        res.render("giangvien/dshv", {
            layout: "layouts/teacher_layout",
            title: "Danh sách học viên",
            user: req.user,
            khoaHoc,
            dsHocVien
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("Lỗi server");
    }
};