/**
 * CMS constants - mirrors backend configuration
 * Backend: stetsom-api/src/lib/upload-validator.ts
 */

export const CMS_UPLOAD_MAX_SIZES = {
  IMAGE: 10 * 1024 * 1024,
  VIDEO: 200 * 1024 * 1024,
  PDF: 50 * 1024 * 1024,
  MODEL3D: 100 * 1024 * 1024,
} as const;

export const CMS_ALLOWED_MIME_TYPES = {
  IMAGE: ["image/jpeg", "image/png", "image/webp", "image/gif"],
  VIDEO: ["video/mp4", "video/webm"],
  PDF: ["application/pdf"],
  MODEL3D: ["model/gltf-binary", "model/gltf+json"],
} as const;

export const CMS_PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_LIMIT: 200,
} as const;

export const CMS_UI = {
  MAX_HIGHLIGHTS: 3,
} as const;
