import { cn } from "@/lib/utils";

export interface AdminPageLayoutProps {
  /** Linha fixa acima do conteúdo — toolbar/busca/botão "Novo", barra de voltar, aviso, etc. */
  header?: React.ReactNode;
  /** Corpo rolável — formulário (edição) ou <AdminDataTable/> (listagem). */
  children: React.ReactNode;
  /** Rodapé fixo, sempre visível. Em páginas de edição, passar <EditorFooter/>. */
  footer?: React.ReactNode;
  contentClassName?: string;
  className?: string;
}

const DEFAULT_CONTENT_PADDING = "px-4 py-4 lg:px-11.75 lg:py-7.25";
/** Use como `contentClassName` quando um `AdminPageHeader` já cobre o padding superior. */
export const ADMIN_PAGE_CONTENT_PADDING_NO_TOP =
  "px-4 pb-4 lg:px-11.75 lg:pb-7.25";

export function AdminPageLayout({
  header,
  children,
  footer,
  contentClassName,
  className,
}: AdminPageLayoutProps) {
  return (
    <div
      className={cn(
        "flex h-full min-h-0 flex-1 flex-col overflow-hidden",
        className,
      )}
    >
      {header && <div className="shrink-0">{header}</div>}
      <div
        className={cn(
          "min-h-0 flex-1 overflow-y-auto",
          contentClassName ?? DEFAULT_CONTENT_PADDING,
        )}
      >
        {children}
      </div>
      {footer && <div className="shrink-0">{footer}</div>}
    </div>
  );
}

export interface AdminPageHeaderProps {
  /** Busca/filtros — alinhado à esquerda. */
  toolbar?: React.ReactNode;
  /** Botão de ação principal ("Novo X") — alinhado à direita. */
  action?: React.ReactNode;
  className?: string;
}

/** Barra padrão de topo para páginas de listagem — usar como `header` do `AdminPageLayout`. */
export function AdminPageHeader({
  toolbar,
  action,
  className,
}: AdminPageHeaderProps) {
  if (!toolbar && !action) return null;
  return (
    <div
      className={cn(
        "flex items-start justify-between gap-4 px-4 pt-4 pb-3 lg:px-11.75 lg:pt-7.25",
        className,
      )}
    >
      <div className="min-w-0 flex-1">{toolbar}</div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
