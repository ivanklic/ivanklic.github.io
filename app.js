const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const captureBtn = document.getElementById("capture");

let stream = null;

async function startCamera() {
  try {
    stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: { exact: "environment" }
      },
      audio: false
    });

    video.srcObject = stream;
    await video.play();

    const track = stream.getVideoTracks()[0];
    const caps = track.getCapabilities();

    // Autofocus continuo (si el hardware lo permite)
    if (caps.focusMode) {
      await track.applyConstraints({
        advanced: [{ focusMode: "continuous" }]
      });
    }

    // Zoom neutro (evita ultrawide sin romper autofocus)
    if (caps.zoom) {
      await track.applyConstraints({
        advanced: [{ zoom: 1 }]
      });
    }

  } catch (err) {
    alert("No se pudo acceder a la cámara: " + err.message);
  }
}

captureBtn.addEventListener("click", () => {
  const width = video.videoWidth;
  const height = video.videoHeight;

  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d");

  // Dibuja el frame actual respetando orientación
  ctx.drawImage(video, 0, 0, width, height);

  // Marca de agua
  const now = new Date();
  const timestamp = now.toLocaleString("es-AR");

  ctx.font = "32px sans-serif";
  ctx.fillStyle = "rgba(255,255,255,0.85)";
  ctx.strokeStyle = "rgba(0,0,0,0.6)";
  ctx.lineWidth = 3;

  const padding = 20;
  const textX = padding;
  const textY = height - padding;

  ctx.strokeText(timestamp, textX, textY);
  ctx.fillText(timestamp, textX, textY);

  // Exporta imagen
  canvas.toBlob(blob => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `foto_${Date.now()}.jpg`;
    a.click();
    URL.revokeObjectURL(url);
  }, "image/jpeg", 0.95);
});

// Inicializa
startCamera();
