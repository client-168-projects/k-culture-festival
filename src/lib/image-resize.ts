/**
 * 업로드 전 브라우저에서 이미지를 축소한다. 원본이 maxDimension(긴 변 기준) 이하면
 * 그대로 반환한다. GIF는 리사이징 시 애니메이션이 깨지므로(캔버스가 첫 프레임만
 * 그림) 건드리지 않고 그대로 반환한다.
 */
export async function resizeImageIfNeeded(
  file: File,
  maxDimension: number,
): Promise<File> {
  if (file.type === "image/gif") return file;
  if (typeof createImageBitmap === "undefined") return file;

  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file);
  } catch {
    return file;
  }

  if (bitmap.width <= maxDimension && bitmap.height <= maxDimension) {
    bitmap.close();
    return file;
  }

  const scale = maxDimension / Math.max(bitmap.width, bitmap.height);
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    bitmap.close();
    return file;
  }

  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, file.type, 0.9),
  );
  if (!blob) return file;

  return new File([blob], file.name, { type: file.type });
}

const TRIM_ALPHA_THRESHOLD = 10;

/**
 * 이미지 가장자리의 투명(alpha) 여백을 실제 콘텐츠 경계까지 자동으로 잘라낸다.
 * 디자인 툴에서 그림자/여백을 남기고 내보낸 PNG(투명 캔버스 안에 작은 카드가 떠 있는
 * 형태)를 그대로 업로드하면 팝업에 원치 않는 여백이 보이는 문제를 업로드 시점에 해결한다.
 */
export async function trimTransparentPadding(file: File): Promise<File> {
  if (file.type === "image/gif" || file.type === "image/jpeg") return file;
  if (typeof createImageBitmap === "undefined") return file;

  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file);
  } catch {
    return file;
  }

  const canvas = document.createElement("canvas");
  canvas.width = bitmap.width;
  canvas.height = bitmap.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    bitmap.close();
    return file;
  }
  ctx.drawImage(bitmap, 0, 0);
  bitmap.close();

  let imageData: ImageData;
  try {
    imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  } catch {
    return file;
  }

  const { data, width, height } = imageData;
  const alphaAt = (x: number, y: number) => data[(y * width + x) * 4 + 3];

  const rowHasContent = (y: number) => {
    for (let x = 0; x < width; x++) {
      if (alphaAt(x, y) > TRIM_ALPHA_THRESHOLD) return true;
    }
    return false;
  };
  const colHasContent = (x: number, top: number, bottom: number) => {
    for (let y = top; y <= bottom; y++) {
      if (alphaAt(x, y) > TRIM_ALPHA_THRESHOLD) return true;
    }
    return false;
  };

  let top = 0;
  let bottom = height - 1;
  let left = 0;
  let right = width - 1;

  while (top < bottom && !rowHasContent(top)) top++;
  while (bottom > top && !rowHasContent(bottom)) bottom--;
  while (left < right && !colHasContent(left, top, bottom)) left++;
  while (right > left && !colHasContent(right, top, bottom)) right--;

  const trimmedWidth = right - left + 1;
  const trimmedHeight = bottom - top + 1;

  // 잘라낼 여백이 거의 없으면(1% 미만) 그대로 둔다.
  if (trimmedWidth >= width * 0.99 && trimmedHeight >= height * 0.99) {
    return file;
  }
  if (trimmedWidth <= 0 || trimmedHeight <= 0) return file;

  const outCanvas = document.createElement("canvas");
  outCanvas.width = trimmedWidth;
  outCanvas.height = trimmedHeight;
  const outCtx = outCanvas.getContext("2d");
  if (!outCtx) return file;
  outCtx.putImageData(imageData, -left, -top);

  const blob = await new Promise<Blob | null>((resolve) =>
    outCanvas.toBlob(resolve, file.type, 0.92),
  );
  if (!blob) return file;

  return new File([blob], file.name, { type: file.type });
}
