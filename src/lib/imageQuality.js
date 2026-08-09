// Lightweight client-side image quality checks for the skin-scan flow.
// Returns metrics + a list of issues. `ok` is true only when no issues found.

function loadImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
}

export async function analyzeImageQuality(url) {
  const img = await loadImage(url);
  const width = img.naturalWidth || img.width;
  const height = img.naturalHeight || img.height;
  const issues = [];

  // Resolution check
  if (width < 400 || height < 400) {
    issues.push({ key: "resolution", message: "Image resolution is too low. Use a higher-resolution photo so details are visible." });
  }

  // Downscale for fast pixel analysis
  const scale = Math.min(1, 200 / Math.max(width, height));
  const w = Math.max(1, Math.round(width * scale));
  const h = Math.max(1, Math.round(height * scale));
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0, w, h);
  let data;
  try {
    data = ctx.getImageData(0, 0, w, h).data;
  } catch {
    return { ok: true, issues: [], metrics: { width, height } };
  }

  // Grayscale + brightness
  const gray = new Float32Array(w * h);
  let sum = 0;
  for (let i = 0; i < w * h; i++) {
    const lum = 0.299 * data[i * 4] + 0.587 * data[i * 4 + 1] + 0.114 * data[i * 4 + 2];
    gray[i] = lum;
    sum += lum;
  }
  const brightness = sum / (w * h);
  if (brightness < 40) {
    issues.push({ key: "brightness", message: "Image is too dark. Retake in brighter, natural lighting." });
  }
  if (brightness > 235) {
    issues.push({ key: "brightness", message: "Image is overexposed (too bright). Reduce glare or move back slightly." });
  }

  // Sharpness via Laplacian variance
  let lapSum = 0, lapSqSum = 0, count = 0;
  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      const idx = y * w + x;
      const lap = 4 * gray[idx] - gray[idx - 1] - gray[idx + 1] - gray[idx - w] - gray[idx + w];
      lapSum += lap;
      lapSqSum += lap * lap;
      count++;
    }
  }
  const mean = lapSum / count;
  const sharpness = lapSqSum / count - mean * mean;
  if (sharpness < 100) {
    issues.push({ key: "blur", message: "Image appears blurry. Keep the camera steady and let it focus before capturing." });
  }

  // Lesion visibility / occupancy heuristic via overall contrast
  let gMean = 0;
  for (let i = 0; i < gray.length; i++) gMean += gray[i];
  gMean /= gray.length;
  let gVar = 0;
  for (let i = 0; i < gray.length; i++) { const d = gray[i] - gMean; gVar += d * d; }
  gVar /= gray.length;
  const contrast = Math.sqrt(gVar);
  if (contrast < 12) {
    issues.push({ key: "visibility", message: "No clear lesion detected. Move closer so the affected skin fills most of the frame." });
  }

  return {
    ok: issues.length === 0,
    issues,
    metrics: {
      width,
      height,
      brightness: Math.round(brightness),
      sharpness: Math.round(sharpness),
      contrast: Math.round(contrast),
    },
  };
}