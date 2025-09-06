const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const captureBtn = document.getElementById("captureBtn");
const status = document.getElementById("status");

// Bật camera
async function startCamera() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;
    status.textContent = "✅ Camera đã sẵn sàng!";
  } catch (err) {
    console.error("Không thể mở camera:", err);
    status.textContent = "❌ Không thể mở camera";
  }
}

startCamera();

// Bắt sự kiện chụp ảnh
captureBtn.addEventListener("click", async () => {
  status.textContent = "⏳ Đang xử lý...";

  // Chụp ảnh từ video
  const context = canvas.getContext("2d");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  context.drawImage(video, 0, 0, canvas.width, canvas.height);

  // Chuyển ảnh sang Blob
  canvas.toBlob(async (blob) => {
    const formData = new FormData();
    formData.append("face", blob, "face.jpg");

    try {
      const res = await fetch("/kiosk/diemdanh", {
        method: "POST",
        body: formData
      });

      const data = await res.json();
      if (data.success) {
        status.textContent = `✅ Xin chào ${data.name}, điểm danh thành công!`;
        status.style.color = "#00ff88";
      } else {
        status.textContent = "⚠️ Không nhận diện được khuôn mặt";
        status.style.color = "#ff4444";
      }
    } catch (err) {
      console.error("Lỗi gửi ảnh:", err);
      status.textContent = "❌ Lỗi hệ thống";
      status.style.color = "#ff4444";
    }
  }, "image/jpeg");
});
