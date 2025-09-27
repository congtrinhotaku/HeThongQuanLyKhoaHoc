const GiangVien = require("../../models/GiangVien");
const NghiPhepHocBu = require("../../models/NghiPhepHocBu");

const KhoaHoc = require("../../models/KhoaHoc");
const mongoose = require("mongoose");
// Hiển thị thông tin cá nhân
exports.getProfile = async (req, res) => {
    try {
        const gv = await GiangVien.findOne({ MaTaiKhoan: req.user._id }).lean();
        if (!gv) {
            return res.status(404).send("Không tìm thấy giảng viên");
        }

        res.render("giangvien/profile", {
            layout: "layouts/teacher_layout",
            title: "Thông tin cá nhân",
            user: req.user,
            gv,
            message: null
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("Có lỗi xảy ra");
    }
};

// Cập nhật thông tin cá nhân
exports.updateProfile = async (req, res) => {
    let message = "";
    try {
        await GiangVien.findOneAndUpdate(
            { MaTaiKhoan: req.user._id },
            {
                $set: {
                    hoTen: req.body.hoTen,
                    ngaySinh: req.body.ngaySinh,
                    gioiTinh: req.body.gioiTinh,
                    email: req.body.email,
                    soDienThoai: req.body.soDienThoai,
                    soZalo: req.body.soZalo,
                    diaChi: req.body.diaChi,
                    trinhDo: req.body.trinhDo,
                    bangCap: req.body.bangCap,
                    soNamKinhNghiem: req.body.soNamKinhNghiem,
                    noiTungDay: req.body.noiTungDay,
                    moTa: req.body.moTa,
                    diemIELTS: req.body.diemIELTS,
                    diemTOEIC: req.body.diemTOEIC,
                    trangThai: req.body.trangThai,
                }
            },
            { new: true }
        );

        message = "Cập nhật thành công!";
    } catch (err) {
        console.error(err);
        message = "Có lỗi xảy ra, vui lòng thử lại!";
    }

    const gv = await GiangVien.findOne({ MaTaiKhoan: req.user._id }).lean();
    res.render("giangvien/profile", {
        layout: "layouts/teacher_layout",
        title: "Thông tin cá nhân",
        user: req.user,
        gv,
        message
    });
};

exports.getKhoaHoc = async (req, res) => {
    try {
        console.log("UserID:", req.user._id);

        // Lấy giảng viên theo tài khoản
        const gv = await GiangVien.findOne({ MaTaiKhoan: req.user._id }).lean();
        if (!gv) {
            return res.status(404).send("Không tìm thấy giảng viên");
        }

        // Lấy danh sách khóa học mà giảng viên này dạy
        const dsKhoaHoc = await KhoaHoc.find({ giangVien: gv._id }).lean();

        res.render("giangvien/duyetnghi_chon_khoahoc", {
            layout: "layouts/teacher_layout",
            title: "Duyệt nghỉ học - Chọn khóa học",
            user: req.user,
            gv,
            dsKhoaHoc
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("Lỗi server");
    }
};
exports.getDonNghiByKhoaHoc = async (req, res) => {
    try {
        const { khoaHocId } = req.params;

        const dsDonNghi = await NghiPhepHocBu.find()
            .populate("hocVien", "hoTen email")
            .populate({
                path: "buoiHoc",
                match: { khoaHoc: khoaHocId },
                select: "ngayHoc gioBatDau gioKetThuc khoaHoc"
            })
            .lean();

        const filtered = dsDonNghi.filter(d => d.buoiHoc);

        res.render("giangvien/duyetnghi_chon_buoihoc", {
            layout: "layouts/teacher_layout",
            title: "Duyệt đơn xin nghỉ",
            user: req.user,
            dsDonNghi: filtered,
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("Lỗi server");
    }
};
exports.gvDuyetDon = async (req, res) => {
    try {
        await NghiPhepHocBu.findByIdAndUpdate(req.params.id, { trangThai: "Duyệt" });
        res.redirect(`/giangvien/xinnghi/khoa/${req.body.khoaHocId}`);
    } catch (err) {
        console.error(err);
        res.status(500).send("Không thể duyệt đơn");
    }
};

exports.gvTuChoiDon = async (req, res) => {
    try {
        await NghiPhepHocBu.findByIdAndUpdate(req.params.id, { trangThai: "Từ chối" });
        res.redirect(`/giangvien/xinnghi/khoa/${req.body.khoaHocId}`);
    } catch (err) {
        console.error(err);
        res.status(500).send("Không thể từ chối đơn");
    }
};