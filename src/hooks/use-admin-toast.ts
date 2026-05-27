import { toast } from "sonner";

export function useAdminToast() {
  return {
    success(message: string, description?: string) {
      toast.success(message, { description });
    },

    error(message: string, description?: string) {
      toast.error(message, {
        description: description ?? "Tente novamente ou contate o suporte.",
      });
    },

    draft(name?: string) {
      toast.success(
        name ? `"${name}" salvo como rascunho` : "Salvo como rascunho",
        {
          description: "Complete os campos obrigatórios para publicar.",
        },
      );
    },

    deleted(name?: string) {
      toast.success(
        name ? `"${name}" excluído com sucesso` : "Excluído com sucesso",
      );
    },

    loading(message: string): string | number {
      return toast.loading(message);
    },

    dismiss(id?: string | number) {
      toast.dismiss(id);
    },
  };
}
