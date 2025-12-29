const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const button = document.getElementById("capture");

async function startCamera() {
  const stream = await navigator.mediaDevices.getUserMedia({
    video: { facingMode: "environment" },
    audio: false
  });

  video.srcObject = stream;

  // fuerza render
  video.onloadedmetadata = () => {
    video.play();
  };
}

button.onclick = () => {
  if (video.videoWidth === 0) {
    alert("La cámara no está activa");
    return;
  }

  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  const ctx = canvas.getContext("2d");
  ctx.drawImage(video, 0, 0);

  const now = new Date().toLocaleString("es-AR");
  ctx.font = "32px sans-serif";
  ctx.fillStyle = "white";
  ctx.strokeStyle = "black";
  ctx.lineWidth = 3;
  ctx.strokeText(now, 20, canvas.height - 20);
  ctx.fillText(now, 20, canvas.height - 20);

  canvas.toBlob(blob => {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `foto_${Date.now()}.jpg`;
    a.click();
  }, "image/jpeg", 0.95);
};

startCamera();
