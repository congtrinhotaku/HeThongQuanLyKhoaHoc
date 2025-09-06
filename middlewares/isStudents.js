const NguoiDung = require("../models/User");

// ================== KIỂM TRA NGƯỜI DÙNG ĐÃ ĐĂNG NHẬP ==================
module.exports =  async function  (req, res, next) {
  try{
    if (req.session.userId && req.session.user) 
    {
     const user = await NguoiDung.findOne({ _id: req.session.userId});
     if (!user) return res.redirect("/login");
     if (user.role != "students") return res.redirect("/login");
     req.user = user;
     next();
    }else 
    {
      return res.redirect("/login");
    }
  }catch (err) {
    console.error("authHocVien middleware error:", err);
    res.status(500).send("Lỗi máy chủ.");
  }
};
