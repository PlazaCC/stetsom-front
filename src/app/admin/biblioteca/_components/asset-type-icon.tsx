import { LibraryAssetType } from "@/api/stetsom/model";
import { Box, FileText, ImageIcon } from "lucide-react";

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
    default:
      return <FileText className={className} />;
  }
}
