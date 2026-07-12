import { LibraryAssetType } from "@/api/stetsom/model";
import {
  Award,
  BookOpen,
  BookText,
  Box,
  FileText,
  ImageIcon,
  Package,
  Shapes,
  Video,
} from "lucide-react";

/** Renders the lucide icon representing a library asset type. */
export function AssetTypeIcon({
  type,
  className,
}: {
  type: LibraryAssetType;
  className?: string;
}) {
  switch (type) {
    case LibraryAssetType.MODEL3D:
      return <Box className={className} />;
    case LibraryAssetType.IMAGE:
      return <ImageIcon className={className} />;
    case LibraryAssetType.CATEGORY_ICON:
      return <Shapes className={className} />;
    case LibraryAssetType.IMAGE_PACK:
      return <Package className={className} />;
    case LibraryAssetType.VIDEO:
      return <Video className={className} />;
    case LibraryAssetType.MANUAL:
      return <BookOpen className={className} />;
    case LibraryAssetType.CATALOG:
      return <BookText className={className} />;
    case LibraryAssetType.CERTIFICATE:
      return <Award className={className} />;
    default:
      return <FileText className={className} />;
  }
}
