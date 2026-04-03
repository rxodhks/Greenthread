"use client";

const DEFAULT_MAX = 1280;
const JPEG_QUALITY = 0.85;

/** 모바일 업로드 부담 완화: 큰 이미지만 최대 변 길이로 JPEG 재인코딩. */
export async function resizeImageForUpload(file: File, maxDim = DEFAULT_MAX): Promise<File> {
  if (!file.type.startsWith("image/") || file.size < 350_000) {
    return file;
  }

  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      let w = img.naturalWidth;
      let h = img.naturalHeight;
      if (w <= maxDim && h <= maxDim) {
        resolve(file);
        return;
      }
      const scale = maxDim / Math.max(w, h);
      w = Math.round(w * scale);
      h = Math.round(h * scale);
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        resolve(file);
        return;
      }
      ctx.drawImage(img, 0, 0, w, h);
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            resolve(file);
            return;
          }
          const base = file.name.replace(/\.[^.]+$/, "") || "scan";
          resolve(new File([blob], `${base}.jpg`, { type: "image/jpeg" }));
        },
        "image/jpeg",
        JPEG_QUALITY,
      );
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(file);
    };
    img.src = url;
  });
}
