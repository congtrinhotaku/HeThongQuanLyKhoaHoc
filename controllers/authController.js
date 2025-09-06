const User = require("../models/User");
const bcrypt = require("bcrypt");

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

    if(user.role = "admin")  return res.redirect("/coso");
    
  } catch (err) {
    res.render("auth/dangnhap", {
      error: "❌ Lỗi đăng nhập: " + err.message,layout: false  
    });
  }
};

exports.logout = (req, res) => {
  req.session.destroy();
  res.redirect("/login");
};
