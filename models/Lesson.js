const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const LessonSchema = new Schema({
  LoaikhoaHoc: { type: Schema.Types.ObjectId, ref: "LoaiKhoaHoc" },
  tenLesson: { type: String, required: true },
  noiDung: { type: String }
});

module.exports = mongoose.model("Lesson", LessonSchema);