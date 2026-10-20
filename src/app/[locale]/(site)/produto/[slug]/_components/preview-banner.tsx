import { draftMode } from "next/headers";
import { redirect } from "next/navigation";

export async function PreviewBanner() {
  const { isEnabled } = await draftMode();
  if (!isEnabled) return null;

  return (
    <div className="fixed right-0 bottom-0 left-0 z-50 flex items-center justify-center gap-4 bg-amber-500 px-4 py-2 text-sm font-medium text-black">
      <span>Modo de pré-visualização ativo</span>
      <form
        action={async () => {
          "use server";
          const draft = await draftMode();
          draft.disable();
          redirect("/admin/produtos");
        }}
      >
        <button
          type="submit"
          className="rounded bg-black/20 px-3 py-1 text-xs font-semibold hover:bg-black/30"
        >
          Sair do preview
        </button>
      </form>
    </div>
  );
}
