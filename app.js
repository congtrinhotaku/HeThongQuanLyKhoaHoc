const express = require("express");
const path = require("path");
const logger = require("morgan");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const methodOverride = require("method-override");
const expressLayouts = require("express-ejs-layouts");
const isAdmin =  require("./middlewares/isAdmin")
const faceapi = require("./config/faceapi");
const tf = require("@tensorflow/tfjs");


// Load biến môi trường
dotenv.config();

console.log("MONGODB_URI =", process.env.MONGODB_URI);


// Kết nối MongoDB
connectDB();

(async () => {
  await tf.setBackend("cpu");
  await tf.ready();
  await faceapi.loadModels();
})();

const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Middleware
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(methodOverride("_method"));
app.use(expressLayouts);
app.set("layout", "layouts/main"); 
app.use((req, res, next) => {
  res.locals.title = "Hệ thống quản lý khóa học"; // title mặc định
  next();
});
// Session
app.use(session({
  secret: process.env.SESSION_SECRET || "supersecret",
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI,   // dùng trực tiếp MONGODB_URI
    ttl: 14 * 24 * 60 * 60
  })
}));

const authRoutes = require("./routes/authRoutes");
const CoSoRoutes = require("./routes/admin/coSoRoutes");
const LoaiKhoaHocRoutes = require("./routes/admin/loaikhoahocRoutes");
const KhoaHocRoutes = require("./routes/admin/khoahocRoutes");
const adminRoutes = require("./routes/admin/adminRoutes");
const UserRoutes = require("./routes/admin/userRoutes");
const GiangVienRoutes = require("./routes/admin/giangvienRoutes");
const HocVienRoutes = require("./routes/admin/hocvienRoutes");
const kioskRoutes = require("./routes/admin/kioskRoutes");
//giang vien
const BaiTapRoutes = require("./routes/giangvien/baitapRoutes");
const indexgiangvien = require("./routes/giangvien/indexRoutes");

const profile = require("./routes/giangvien/giangvienprofileRoutes");
//hoc vien
const hocvien_profile = require("./routes/hocvien/hocvien_profile");
const khoahocRoutes = require("./routes/giangvien/khoahocRoutes");


app.use("/", authRoutes);
app.use("/admin/coso", isAdmin, CoSoRoutes);
app.use("/admin/loaikhoahoc", isAdmin, LoaiKhoaHocRoutes);
app.use("/admin/khoahoc", isAdmin, KhoaHocRoutes);
app.use("/admin", isAdmin, adminRoutes);
app.use("/admin/user", isAdmin, UserRoutes);
app.use("/admin/giangvien", isAdmin, GiangVienRoutes);
app.use("/admin/hocvien", isAdmin, HocVienRoutes); 
app.use("/kiosk", kioskRoutes);
//giang vien
app.use("/giangvien", indexgiangvien);
app.use("/giangvien/baitap", BaiTapRoutes);
app.use("/giangvien", profile);
app.use("/giangvien/khoahoc", khoahocRoutes);

//hoc vien
app.use("/hocvien", hocvien_profile);


// 404 handler
app.use((req, res) => {
  const err = new Error("Trang không tồn tại");
  err.status = 404;
  res.status(404).render("error", { message: err.message, error: err });
});


// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server chạy tại http://localhost:${PORT}`);
});

module.exports = app;
