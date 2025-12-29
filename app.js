button.addEventListener("click", () => {
  const videoWidth = video.videoWidth;
  const videoHeight = video.videoHeight;

  const targetRatio = TARGET_WIDTH / TARGET_HEIGHT;
  const videoRatio = videoWidth / videoHeight;

  let sx, sy, sw, sh;

  if (videoRatio > targetRatio) {
    // video más ancho → recortar lados
    sh = videoHeight;
    sw = sh * targetRatio;
    sx = (videoWidth - sw) / 2;
    sy = 0;
  } else {
    // video más alto → recortar arriba/abajo
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
    a.download = `foto-${Date.now()}.jpg`;
    a.click();
    URL.revokeObjectURL(url);
  }, "image/jpeg", 0.9);
});

