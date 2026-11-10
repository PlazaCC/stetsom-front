import { toast } from "sonner";
import { getApiError, getApiErrorMessage } from "@/lib/api/error-utils";
import { createElement } from "react";

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

    /** Error toast whose message is resolved from the contract error code. */
    apiError(error: unknown, fallback: string) {
      const apiError = getApiError(error);
      const messages = Object.values(apiError.fields);
      if (messages.length <= 1) {
        toast.error(messages[0] ?? getApiErrorMessage(error, fallback));
        return;
      }

      const visible = messages.slice(0, 3).join("\n");
      const remaining = messages.length - 3;
      toast.error(`Corrija ${messages.length} campos`, {
        description: createElement(
          "span",
          { className: "whitespace-pre-line" },
          remaining > 0
            ? `${visible}\n+ ${remaining} campo(s) com erro.`
            : visible,
        ),
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
