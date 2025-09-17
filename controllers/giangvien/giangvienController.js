const GiangVien = require("../../models/GiangVien");
const KhoaHoc = require("../../models/KhoaHoc");

exports.getTrangchu = async (req, res) => {
    try {
        const gv = await GiangVien.findOne({ MaTaiKhoan: req.user._id }).lean();
        if (!gv) {
            return res.status(404).send("Không tìm thấy giảng viên");
        }

       
        let { nam, thang } = req.query;

       
        const now = new Date();
        nam = nam ? parseInt(nam) : now.getFullYear();
        thang = thang ? parseInt(thang) : now.getMonth() + 1;

        // Tính khoảng thời gian lọc
        const startDate = new Date(nam, thang - 1, 1); // đầu tháng
        const endDate = new Date(nam, thang, 0, 23, 59, 59); // cuối tháng

        // Lọc danh sách khóa học của GV theo tháng/năm
        const dskh = await KhoaHoc.find({
            giangVien: gv._id,
            thoiGianBatDau: { $gte: startDate, $lte: endDate },
        }).lean();

        res.render("giangvien/trangchu", {
            layout: "layouts/main",
            title: "Trang chủ",
            user: req.user,
            gv,
            dskh,
            nam,
            thang,
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("Có lỗi xảy ra");
    }
};
