const faceapi = require("face-api.js");
const canvas = require("canvas");
const path = require("path");

require("@tensorflow/tfjs-node");

// Monkey patch để face-api.js chạy với Node.js
const { Canvas, Image, ImageData } = canvas;
faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

// Đường dẫn models
const MODEL_URL = path.join(__dirname, "../public/facemodels");

const loadModels = async () => {
  try {
    console.log("🔄 Đang load face-api.js models...");
    await Promise.all([
      faceapi.nets.ssdMobilenetv1.loadFromDisk(MODEL_URL),
      faceapi.nets.faceLandmark68Net.loadFromDisk(MODEL_URL),
      faceapi.nets.faceRecognitionNet.loadFromDisk(MODEL_URL),
    ]);
    console.log("✅ Models đã load xong!");
  } catch (err) {
    console.error("❌ Lỗi load models:", err);
  }
};

faceapi.loadModels = loadModels;
module.exports = faceapi;
