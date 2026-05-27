"use client";

import { Toaster as Sonner } from "sonner";

/**
 * Wrapper do Toaster do Sonner com configurações do projeto.
 * Adicionar em layouts que precisam de toast feedback (ex: admin layout).
 */
export function Toaster() {
  return (
    <Sonner
      position="bottom-right"
      richColors
      closeButton
      toastOptions={{
        classNames: {
          toast: "font-sans text-sm",
        },
      }}
    />
  );
}
