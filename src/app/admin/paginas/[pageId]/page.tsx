"use client";

import { use } from "react";
import { PageEditorContent } from "../_components/page-editor-content";

interface PageParams {
  pageId: string;
}

export default function AdminPageSectionsPage({
  params,
}: {
  params: Promise<PageParams>;
}) {
  const { pageId } = use(params);
  return <PageEditorContent pageId={pageId} />;
}
