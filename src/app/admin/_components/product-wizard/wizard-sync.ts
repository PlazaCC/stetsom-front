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
import type { WizardFile, WizardImage, WizardState } from "./wizard-store";

/**
 * What the product holds on the server, which the next save diffs against.
 *
 * The sync functions update it as each request succeeds. A save that fails
 * halfway therefore keeps what it already persisted, and saving again never
 * re-creates a block, image or file the server already has.
 *
 * Requests run one at a time on purpose: the API rewrites the whole
 * blocks/images/files array on every call, so parallel calls overwrite each
 * other and only the last one sticks.
 */
export interface SyncLedger {
  /** Server ids of the product's blocks. */
  blockIds: string[];
  /** Editor block id → server `block_id`, for blocks created in this editor. */
  blockServerIds: Record<string, string>;
  /** Server ids of the product's gallery images, in gallery order. */
  imageIds: string[];
  /** `WizardImage.id` → `image_id`, for images linked in this editor. */
  newImageIds: Record<string, string>;
  /** Server ids of the product's files. */
  fileIds: string[];
  /** `WizardFile.id` → `file_id`, for files linked in this editor. */
  newFileIds: Record<string, string>;
}

export function createSyncLedger(state: WizardState): SyncLedger {
  return {
    blockIds: [...state.initialBlockIds],
    blockServerIds: { ...state.blockServerIds },
    imageIds: [...state.initialImageIds],
    newImageIds: {},
    fileIds: [...state.initialFileIds],
    newFileIds: {},
  };
}

/** Reconcile product page-blocks via the block sub-resource endpoints. */
export async function syncBlocks(
  id: string,
  blocks: DraftBlock[],
  ledger: SyncLedger,
): Promise<void> {
  const serverIdOf = (block: DraftBlock) =>
    ledger.blockServerIds[block.id] ??
    (ledger.blockIds.includes(block.id) ? block.id : undefined);

  const kept = new Set(blocks.map(serverIdOf));
  for (const bid of ledger.blockIds.filter((bid) => !kept.has(bid))) {
    await deleteApiProductsIdBlocksBlockId(id, bid);
    ledger.blockIds = ledger.blockIds.filter((other) => other !== bid);
  }

  for (const block of blocks) {
    const body = {
      type: block.type as PostApiProductsIdBlocksBodyType,
      order: block.order,
      data: block.data as PostApiProductsIdBlocksBodyData,
    };
    const serverId = serverIdOf(block);
    if (serverId) {
      await patchApiProductsIdBlocksBlockId(id, serverId, body);
    } else {
      const created = await postApiProductsIdBlocks(id, body);
      ledger.blockServerIds[block.id] = created.block_id;
      ledger.blockIds.push(created.block_id);
    }
  }
}

/**
 * Reconcile the product gallery: delete removed images, link new ones from the
 * library by `library_id`, and patch the order of existing ones. Image at order
 * 0 is the catalog cover.
 */
export async function syncImages(
  id: string,
  images: WizardImage[],
  ledger: SyncLedger,
): Promise<void> {
  const serverIdOf = (img: WizardImage) =>
    img.image_id ?? ledger.newImageIds[img.id];

  const kept = new Set(images.map(serverIdOf));
  for (const iid of ledger.imageIds.filter((iid) => !kept.has(iid))) {
    await deleteApiProductsIdImagesImageId(id, iid);
    ledger.imageIds = ledger.imageIds.filter((other) => other !== iid);
  }

  for (const [index, img] of images.entries()) {
    const serverId = serverIdOf(img);
    if (!serverId) {
      const created = await postApiProductsIdImages(id, {
        library_id: img.library_id,
        order: index,
      });
      ledger.newImageIds[img.id] = created.image_id;
      ledger.imageIds.push(created.image_id);
    } else if (ledger.imageIds.indexOf(serverId) !== index) {
      await patchApiProductsIdImagesImageId(id, serverId, { order: index });
    }
  }

  // Every image is linked and ordered now; the server order is the gallery's.
  ledger.imageIds = images.map(serverIdOf).filter((iid) => iid !== undefined);
}

/** Reconcile product files: delete removed, link new, patch active state on existing. */
export async function syncFiles(
  id: string,
  files: WizardFile[],
  ledger: SyncLedger,
): Promise<void> {
  const serverIdOf = (f: WizardFile) => f.file_id ?? ledger.newFileIds[f.id];

  const kept = new Set(files.map(serverIdOf));
  for (const fid of ledger.fileIds.filter((fid) => !kept.has(fid))) {
    await deleteApiProductsIdFilesFileId(id, fid);
    ledger.fileIds = ledger.fileIds.filter((other) => other !== fid);
  }

  for (const f of files) {
    const serverId = serverIdOf(f);
    if (!serverId) {
      const created = await postApiProductsIdFiles(id, {
        library_id: f.library_id,
        is_active: f.is_active,
      });
      ledger.newFileIds[f.id] = created.file_id;
      ledger.fileIds.push(created.file_id);
    } else {
      await patchApiProductsIdFilesFileId(id, serverId, {
        is_active: f.is_active,
      });
    }
  }
}
