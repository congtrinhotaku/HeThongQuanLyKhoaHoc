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
app.use(methodOverride("_method"));
app.use(expressLayouts);
app.set("layout", "layouts/main"); 

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

// Routes
const authRoutes = require("./routes/authRoutes");
// const adminRoutes = require("./routes/adminRoutes");
const employeeRoutes = require("./routes/employeeRoutes");
// const categoryRoutes = require("./routes/categoryRoutes");

app.use("/", authRoutes);
// app.use("/admin", isAdmin, adminRoutes);
app.use("/employees",isAdmin, employeeRoutes);
// app.use("/categories", categoryRoutes);
app.use("/kiosk", require("./routes/kioskRoutes"));


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
