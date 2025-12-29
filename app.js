const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const button = document.getElementById("shoot");

// Resolución FINAL vertical
const TARGET_WIDTH = 720;
const TARGET_HEIGHT = 1280;

async function startCamera() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: { ideal: "environment" }
      },
      audio: false
    });

    video.srcObject = stream;
  } catch (err) {
    alert("No se pudo acceder a la cámara: " + err.message);
  }
}

button.addEventListener("click", () => {
  const vw = video.videoWidth;
  const vh = video.videoHeight;

  const targetRatio = TARGET_WIDTH / TARGET_HEIGHT;
  const videoRatio = vw / vh;

  let sx, sy, sw, sh;

  if (videoRatio > targetRatio) {
    // video más ancho → recorto costados
    sh = vh;
    sw = sh * targetRatio;
    sx = (vw - sw) / 2;
    sy = 0;
  } else {
    // video más alto → recorto arriba/abajo
    sw = vw;
    sh = sw / targetRatio;
    sx = 0;
    sy = (vh - sh) / 2;
  }

  canvas.width = TARGET_WIDTH;
  canvas.height = TARGET_HEIGHT;

  const ctx = canvas.getContext("2d");

  // Dibujo la foto
  ctx.drawImage(
    video,
    sx, sy, sw, sh,
    0, 0, TARGET_WIDTH, TARGET_HEIGHT
  );

  // =====================
  // Marca de agua fecha/hora
  // =====================
  const now = new Date();
  const fecha = now.toLocaleDateString("es-AR");
  const hora = now.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" });

  const texto = `${fecha} ${hora}`;

  ctx.font = "28px sans-serif";
  ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
  ctx.fillRect(20, TARGET_HEIGHT - 60, ctx.measureText(texto).width + 20, 40);

  ctx.fillStyle = "white";
  ctx.fillText(texto, 30, TARGET_HEIGHT - 32);

  // =====================

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
