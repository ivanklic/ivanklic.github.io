const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const captureBtn = document.getElementById("capture");

let stream = null;

async function startCamera() {
  try {
    stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: { ideal: "environment" }
      },
      audio: false
    });

    video.srcObject = stream;
    video.setAttribute("playsinline", true);
    await video.play();

    const track = stream.getVideoTracks()[0];
    const caps = track.getCapabilities?.();

    // Autofocus continuo SOLO si está soportado
    if (caps && caps.focusMode && caps.focusMode.includes("continuous")) {
      await track.applyConstraints({
        advanced: [{ focusMode: "continuous" }]
      });
    }

  } catch (err) {
    alert("Error accediendo a la cámara: " + err.message);
  }
}

captureBtn.addEventListener("click", () => {
  if (!video.videoWidth || !video.videoHeight) {
    alert("La cámara aún no está lista");
    return;
  }

  const width = video.videoWidth;
  const height = video.videoHeight;

  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d");
  ctx.drawImage(video, 0, 0, width, height);

  // Marca de agua
  const now = new Date();
  const timestamp = now.toLocaleString("es-AR");

  ctx.font = "32px sans-serif";
  ctx.fillStyle = "rgba(255,255,255,0.9)";
  ctx.strokeStyle = "rgba(0,0,0,0.6)";
  ctx.lineWidth = 3;

  const padding = 24;
  ctx.strokeText(timestamp, padding, height - padding);
  ctx.fillText(timestamp, padding, height - padding);

  canvas.toBlob(blob => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `foto_${Date.now()}.jpg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, "image/jpeg", 0.95);
});

startCamera();
