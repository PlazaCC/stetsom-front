import {
  deleteApiProductsIdBlocksBlockId,
  deleteApiProductsIdFilesFileId,
  deleteApiProductsIdImagesImageId,
  patchApiProductsIdBlocksBlockId,
  patchApiProductsIdFilesFileId,
  patchApiProductsIdImagesImageId,
  postApiProductsIdBlocks,
  postApiProductsIdFiles,
  postApiProductsIdImages,
} from "@/api/stetsom";
import type {
  PostApiProductsIdBlocksBodyData,
  PostApiProductsIdBlocksBodyType,
} from "@/api/stetsom/model";
import type { DraftBlock } from "@/app/admin/_components/crud/block-manager";
import type { WizardFile, WizardImage } from "./wizard-store";

/** Reconcile product page-blocks via the block sub-resource endpoints. */
export async function syncBlocks(
  id: string,
  blocks: DraftBlock[],
  initialBlockIds: string[],
): Promise<void> {
  const currentIds = new Set(blocks.map((b) => b.id));
  const removed = initialBlockIds.filter((bid) => !currentIds.has(bid));
  await Promise.all(
    removed.map((bid) => deleteApiProductsIdBlocksBlockId(id, bid)),
  );

  for (const block of blocks) {
    const body = {
      type: block.type as PostApiProductsIdBlocksBodyType,
      order: block.order,
      data: block.data as PostApiProductsIdBlocksBodyData,
    };
    if (initialBlockIds.includes(block.id)) {
      await patchApiProductsIdBlocksBlockId(id, block.id, body);
    } else {
      await postApiProductsIdBlocks(id, body);
    }
  }
}

/**
 * Reconcile the product gallery: delete removed images, upload new ones via the
 * presign-on-POST flow, and patch the order of existing ones. Image at order 0
 * is the catalog cover.
 */
export async function syncImages(
  id: string,
  images: WizardImage[],
  initialImageIds: string[],
): Promise<void> {
  const currentImageIds = new Set(
    images.filter((img) => img.image_id).map((img) => img.image_id as string),
  );
  const removed = initialImageIds.filter((iid) => !currentImageIds.has(iid));
  await Promise.all(
    removed.map((iid) => deleteApiProductsIdImagesImageId(id, iid)),
  );

  for (const [index, img] of images.entries()) {
    if (img.file) {
      const { upload } = await postApiProductsIdImages(id, {
        file: {
          fileName: img.file.name,
          mimeType: img.file.type,
          sizeBytes: img.file.size,
        },
        order: index,
      });
      await fetch(upload.uploadUrl, {
        method: upload.method,
        headers: upload.headers as Record<string, string>,
        body: img.file,
      });
    } else if (img.image_id && img.order !== index) {
      await patchApiProductsIdImagesImageId(id, img.image_id, { order: index });
    }
  }
}

/** Reconcile product files: delete removed, link new, patch active state on existing. */
export async function syncFiles(
  id: string,
  files: WizardFile[],
  initialFileIds: string[],
): Promise<void> {
  const currentFileIds = new Set(
    files.filter((f) => f.file_id).map((f) => f.file_id as string),
  );
  const removed = initialFileIds.filter((fid) => !currentFileIds.has(fid));
  await Promise.all(
    removed.map((fid) => deleteApiProductsIdFilesFileId(id, fid)),
  );

  for (const f of files) {
    if (!f.file_id) {
      await postApiProductsIdFiles(id, {
        library_id: f.library_id,
        is_active: f.is_active,
      });
    } else if (initialFileIds.includes(f.file_id)) {
      await patchApiProductsIdFilesFileId(id, f.file_id, {
        is_active: f.is_active,
      });
    }
  }
}
