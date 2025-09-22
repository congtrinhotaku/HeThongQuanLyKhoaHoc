const GiangVien = require("../../models/GiangVien");

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


