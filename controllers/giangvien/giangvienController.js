const GiangVien = require("../../models/GiangVien");
const KhoaHoc = require("../../models/KhoaHoc");
const BuoiHoc = require("../../models/BuoiHoc");

exports.getTrangchu = async (req, res) => {
    try {
        const gv = await GiangVien.findOne({ MaTaiKhoan: req.user._id }).lean();
        if (!gv) return res.status(404).send("Không tìm thấy giảng viên");

        let { nam, thang } = req.query;
        const now = new Date();
        nam = nam ? parseInt(nam) : now.getFullYear();
        thang = thang ? parseInt(thang) : now.getMonth() + 1;

        // Lấy tất cả khóa học của GV
        const dskh = await KhoaHoc.find({ giangVien: gv._id })
            .populate({ path: "loaiKhoaHoc", select: "tenLoai -_id" })
            .populate({ path: "phongHoc", populate: { path: "coSo", model: "CoSo" } })
            .lean();

        // Gán lichHoc cho từng khóa học, không giới hạn ngày
        for (let kh of dskh) {
            const lichHoc = await BuoiHoc.find({ khoaHoc: kh._id })
                .sort({ ngayHoc: 1, gioBatDau: 1 })
                .lean();

            kh.lichHoc = lichHoc.map(lh => ({
                ...lh,
                ngayHoc: new Date(lh.ngayHoc)
            }));
        }

        res.render("giangvien/trangchu", {
            layout: "layouts/teacher_layout",
            title: "Trang chủ",
            user: req.user,
            gv,
            dskh,
            nam,
            thang,
            thuVN: ["Chủ nhật", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"]
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("Có lỗi xảy ra");
    }
};
