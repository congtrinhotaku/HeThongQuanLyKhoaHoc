const LoaiKhoaHoc = require("../models/LoaiKhoaHoc");
const Lesson = require("../models/Lesson");

// Danh sách loại khóa học
exports.getAllLoai = async (req, res) => {
  const DSLoai = await LoaiKhoaHoc.find().lean();
  res.render("admin/loaikhoahoc", {
    layout: "layouts/main",
    title: "Quản lý Loại Khóa Học",
    user: req.user,
    DSLoai
  });
};

// Trang chi tiết + CRUD lesson
exports.getDetailLoai = async (req, res) => {
  const loai = await LoaiKhoaHoc.findById(req.params.id).lean();
  if (!loai) return res.status(404).send("Không tìm thấy loại khóa học");

  const lessons = await Lesson.find({ LoaikhoaHoc: loai._id }).lean();

  res.render("admin/loaikhoahoc_detail", {
    layout: "layouts/main",
    title: "Chi tiết Loại Khóa Học",
    user: req.user,
    loai,
    lessons
  });
};

// CRUD Loại khóa học
exports.addLoai = async (req, res) => {
  const { tenLoai, moTa } = req.body;
  await LoaiKhoaHoc.create({ tenLoai, moTa });
  res.redirect("/admin/loaikhoahoc");
};

exports.updateLoai = async (req, res) => {
  const { tenLoai, moTa } = req.body;
  await LoaiKhoaHoc.findByIdAndUpdate(req.params.id, { tenLoai, moTa });
  res.redirect(`/admin/loaikhoahoc/${req.params.id}`);
};

exports.deleteLoai = async (req, res) => {
  await LoaiKhoaHoc.findByIdAndDelete(req.params.id);
  res.redirect("/admin/loaikhoahoc");
};

// ------------------- CRUD Lesson -------------------
exports.addLesson = async (req, res) => {
  const { tenLesson, noiDung } = req.body;
  await Lesson.create({ tenLesson, noiDung, LoaikhoaHoc: req.params.id });
  res.redirect(`/admin/loaikhoahoc/${req.params.id}`);
};

exports.updateLesson = async (req, res) => {
  const { tenLesson, noiDung } = req.body;
  await Lesson.findByIdAndUpdate(req.params.lessonId, { tenLesson, noiDung });
  res.redirect(`/admin/loaikhoahoc/${req.params.id}`);
};

exports.deleteLesson = async (req, res) => {
  await Lesson.findByIdAndDelete(req.params.lessonId);
  res.redirect(`/admin/loaikhoahoc/${req.params.id}`);
};
