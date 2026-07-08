"use client";

import type { GeocodeSuggestion } from "@/lib/geocode";
import { Loader2, MapPin, Search, X } from "lucide-react";

interface GeocodeDropdownProps {
  isCepMode: boolean;
  geocodeLoading: boolean;
  cepComplete: boolean;
  missingCount: number;
  suggestions: GeocodeSuggestion[];
  query: string;
  onSelect: (suggestion: GeocodeSuggestion) => void;
}

export function GeocodeDropdown({
  isCepMode,
  geocodeLoading,
  cepComplete,
  missingCount,
  suggestions,
  query,
  onSelect,
}: GeocodeDropdownProps) {
  if (isCepMode) {
    if (geocodeLoading) {
      return (
        <div className="flex items-center gap-2 px-3 py-2 text-xs text-icon-muted">
          <Loader2 size={12} className="animate-spin" />
          <span>Buscando por CEP...</span>
        </div>
      );
    }
    if (!cepComplete) {
      return (
        <div className="flex items-center gap-2 px-3 py-2 text-xs text-icon-muted">
          <Search size={12} />
          <span>
            Faltam {missingCount} dígito
            {missingCount !== 1 ? "s" : ""} do CEP
          </span>
        </div>
      );
    }
    if (cepComplete && suggestions.length === 0) {
      return (
        <div className="flex items-center gap-2 px-3 py-2 text-xs text-icon-muted">
          <X size={12} />
          <span>CEP não encontrado</span>
        </div>
      );
    }
    return suggestions.map((s, i) => (
      <button
        key={`${s.lat}-${s.lng}-${i}`}
        type="button"
        onClick={() => onSelect(s)}
        className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition-colors hover:bg-muted"
      >
        <MapPin size={12} className="shrink-0 text-icon-muted" />
        <span>{s.displayName}</span>
      </button>
    ));
  }

  if (query.length < 2) return null;

  if (geocodeLoading) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 text-xs text-icon-muted">
        <Loader2 size={12} className="animate-spin" />
        <span>Buscando por cidades...</span>
      </div>
    );
  }

  if (suggestions.length === 0) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 text-xs text-icon-muted">
        <X size={12} />
        <span>Nenhuma cidade encontrada</span>
      </div>
    );
  }

  return suggestions.map((s, i) => (
    <button
      key={`${s.lat}-${s.lng}-${i}`}
      type="button"
      onClick={() => onSelect(s)}
      className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition-colors hover:bg-muted"
    >
      <Search size={12} className="shrink-0 text-icon-muted" />
      <span>{s.displayName}</span>
    </button>
  ));
}
