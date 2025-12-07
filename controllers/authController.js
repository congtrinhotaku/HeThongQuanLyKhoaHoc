const User = require("../models/User");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const transporter = require("../config/nodemailer"); // Giả sử bạn tạo file config/nodemailer.js
const { node } = require("@tensorflow/tfjs-node");
require('dotenv').config();

exports.getRegister = (req, res) => {
  res.render("auth/dangky", { error: null, layout: false  });
};

exports.postRegister = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
        return res.render("auth/dangky", {
          error: "Email đã được sử dụng. Vui lòng dùng email khác.",layout: false  
        });
    }

    // Tạo user mới
    const user = new User({ username, email, password });

   

    await user.save();

   

    res.redirect("/login");
  } catch (err) {
    console.error("Lỗi đăng ký:", err);
    res.render("auth/dangky", {
      error: "Lỗi đăng ký: " + err.message,layout: false  
    });
  }
};


exports.getLogin = (req, res) => {
  res.render("auth/dangnhap", { error: null,layout: false  });
};

exports.postLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.render("auth/dangnhap", {
        error: "❌ Email không tồn tại.",layout: false  
      });
    }


    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.render("auth/dangnhap", {
        error: "❌ Sai mật khẩu.",layout: false  
      });
    }

    // Lưu session
    req.session.userId = user._id;
    req.session.user = user;


    if(user.role === "admin")  return res.redirect("/admin");
    if (user.role === "teacher") return res.redirect("/giangvien");
    if (user.role === "student"){
      if(!user.active){
        return res.redirect("/active");
      }
      return res.redirect("/hocvien");
    }
    
   
  } catch (err) {
    res.render("auth/dangnhap", {
      error: "❌ Lỗi đăng nhập: " + err.message,layout: false  
    });
  }
};

exports.getActivate = async (req, res) => {
  try {
    const user = req.session.user;
    if (!user) return res.redirect('/login');

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpire = Date.now() + 5 * 60 * 1000;

    await User.findByIdAndUpdate(user._id, {
      OTP: otp,
      OTPExpire: otpExpire,
    });

    // Tạo transporter trực tiếp
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // app password
      },
    });

    await transporter.sendMail({
      from: `"Hệ Thống Quản Lý Khóa Học" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "Mã OTP kích hoạt tài khoản",
      html: `
        <p>Chào mừng bạn đến với hệ thống của chúng tôi.</p>
        <p>Mã OTP của bạn là: <strong>${otp}</strong></p>
        <p>Mã sẽ hết hạn sau 5 phút.</p>
      `,
    });

    return res.render("auth/activate", {
      error: null,
      email: user.email,
      layout: false,
      user: req.session.user
    });

  } catch (err) {
    console.error("Lỗi khi gửi OTP:", err);
    return res.render("auth/activate", {
      error: "Không thể gửi OTP. Vui lòng thử lại.",
      email: req.session.user?.email,
      layout: false,
      user: req.session.user
    });
  }
};


exports.postActivate = async (req, res) => {
    const { email, otp } = req.body;
    try {
        const user = await User.findOne({ email: email, OTP: otp });

        if (!user) {
            return res.render("auth/activate", { error: "Mã OTP không hợp lệ hoặc đã hết hạn.", email: email, user: req.session.user, layout: false });
        }

        // Kích hoạt tài khoản và xóa OTP
        user.active = true;
        user.OTP = undefined; // hoặc null
        await user.save();

        return res.redirect("/hocvien"); // Chuyển hướng đến trang đăng nhập sau khi kích hoạt thành công
    } catch (err) {
        console.error("Lỗi kích hoạt tài khoản:", err);
        res.render("auth/activate", { error: "Lỗi máy chủ nội bộ.", email: email, user: req.session.user, layout: false });
    }
};

exports.logout = (req, res) => {
  req.session.destroy();
  res.redirect("/login");
};
