"use client";

import { useGetApiPagesIconOptions } from "@/api/stetsom";
import { AdminLabel } from "@/app/admin/_components/crud/admin-input";
import { PageIcon } from "@/components/page-icons/page-icon";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function PageIconField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const icons = useGetApiPagesIconOptions();
  return (
    <div className="space-y-1.5">
      <AdminLabel>{label}</AdminLabel>
      <Select
        value={value || null}
        onValueChange={(next) => {
          if (next) onChange(next);
        }}
      >
        <SelectTrigger className="w-full" aria-label={label}>
          <SelectValue
            placeholder={
              icons.isError
                ? "Não foi possível carregar os ícones"
                : "Selecione um ícone"
            }
          />
        </SelectTrigger>
        <SelectContent>
          {icons.data?.map((icon) => (
            <SelectItem key={icon.name} value={icon.name}>
              <span className="flex items-center gap-2">
                <PageIcon name={icon.name} className="size-4" />
                {icon.label}
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {icons.isError && (
        <button
          type="button"
          onClick={() => void icons.refetch()}
          className="text-xs text-destructive underline"
        >
          Tentar carregar novamente
        </button>
      )}
    </div>
  );
}
