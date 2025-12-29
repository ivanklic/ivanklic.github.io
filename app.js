const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const button = document.getElementById("shoot");

const TARGET_WIDTH = 1280;
const TARGET_HEIGHT = 720;

async function startCamera() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: { ideal: "environment" },
        width: { ideal: TARGET_WIDTH },
        height: { ideal: TARGET_HEIGHT }
      },
      audio: false
    });

    video.srcObject = stream;
  } catch (err) {
    alert("No se pudo acceder a la cámara: " + err.message);
  }
}

button.addEventListener("click", () => {
  const videoWidth = video.videoWidth;
  const videoHeight = video.videoHeight;

  const targetRatio = TARGET_WIDTH / TARGET_HEIGHT;
  const videoRatio = videoWidth / videoHeight;

  let sx, sy, sw, sh;

  if (videoRatio > targetRatio) {
    // recorta los costados
    sh = videoHeight;
    sw = sh * targetRatio;
    sx = (videoWidth - sw) / 2;
    sy = 0;
  } else {
    // recorta arriba y abajo
    sw = videoWidth;
    sh = sw / targetRatio;
    sx = 0;
    sy = (videoHeight - sh) / 2;
  }

  canvas.width = TARGET_WIDTH;
  canvas.height = TARGET_HEIGHT;

  const ctx = canvas.getContext("2d");
  ctx.drawImage(
    video,
    sx, sy, sw, sh,
    0, 0, TARGET_WIDTH, TARGET_HEIGHT
  );

  canvas.toBlob(blob => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.setAttribute("download", `foto-${Date.now()}.jpg`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, "image/jpeg", 0.9);
});

startCamera();
