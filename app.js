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
  canvas.width = TARGET_WIDTH;
  canvas.height = TARGET_HEIGHT;

  const ctx = canvas.getContext("2d");
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  canvas.toBlob(blob => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "foto.jpg";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, "image/jpeg", 0.9);
});

startCamera();
