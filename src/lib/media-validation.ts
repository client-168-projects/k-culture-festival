import { ALLOWED_IMAGE_MIME_TYPES, MAX_IMAGE_SIZE_BYTES } from "@/constants/media";
import { formatFileSize } from "@/lib/utils";

/** 업로드 전 이미지 파일 검증 (클라이언트) */
export function validateImageFile(file: File): string | null {
  if (!ALLOWED_IMAGE_MIME_TYPES.includes(file.type)) {
    return "PNG, JPEG, WEBP, GIF 이미지만 업로드할 수 있습니다.";
  }
  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    return `이미지는 ${formatFileSize(MAX_IMAGE_SIZE_BYTES)} 이하만 업로드할 수 있습니다.`;
  }
  return null;
}
