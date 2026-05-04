"use client";

import { useState } from "react";
import Image from "next/image";
import { Search } from "lucide-react";
import ProductCard from "@/components/ui/product-card";

const ALL_PRODUCTS = [
  {
    id: 1,
    name: "ST-4000EQ 4 CANAIS",
    category: "Amplificador",
    spec: "4x 1000W RMS",
    badge: "Novo",
    img: "/product-image.png",
  },
  {
    id: 2,
    name: "ST-2000EQ MONO",
    category: "Módulo",
    spec: "1x 2000W RMS",
    badge: null,
    img: "/product-image.png",
  },
  {
    id: 3,
    name: "ST-800.4 COMPACT",
    category: "Amplificador",
    spec: "4x 200W RMS",
    badge: "Oferta",
    img: "/product-image-2.png",
  },
  {
    id: 4,
    name: "ST-1200.1D BASS",
    category: "Módulo",
    spec: "1x 1200W RMS",
    badge: null,
    img: "/product-image-2.png",
  },
  {
    id: 5,
    name: "ST-600.4 ULTRA",
    category: "Amplificador",
    spec: "4x 150W RMS",
    badge: null,
    img: "/product-image.png",
  },
  {
    id: 6,
    name: "ST-350.4 MINI",
    category: "Amplificador",
    spec: "4x 87W RMS",
    badge: null,
    img: "/product-image-2.png",
  },
];

const CATEGORIES = [
  "Todos",
  "Amplificadores",
  "Módulos",
  "Subwoofers",
  "Acessórios",
];

export default function ProdutosPage() {
  const [activeCategory, setActiveCategory] = useState("Todos");
  const [search, setSearch] = useState("");

  const filtered = ALL_PRODUCTS.filter((p) => {
    const matchCat =
      activeCategory === "Todos" ||
      p.category
        .toLowerCase()
        .includes(activeCategory.toLowerCase().slice(0, -1));
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div>
      {/* HERO */}
      <section className="relative bg-[rgb(9,9,11)] overflow-hidden h-[200px] md:h-[280px] lg:h-[357px]">
        <Image
          src="/produtos-hero.png"
          alt=""
          fill
          className="object-cover opacity-40"
          priority
        />
        <div className="relative z-10 pt-8 md:pt-16 lg:pt-[103px] px-4 md:px-8 lg:px-[170px] max-w-[1440px] mx-auto">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-6 h-px bg-brand shrink-0" />
            <span className="font-sans-condensed font-medium text-xs md:text-base uppercase text-brand">
              CATÁLOGO COMPLETO
            </span>
          </div>
          <h1 className="font-sans-condensed font-black text-[32px] md:text-[48px] lg:text-[60px] leading-tight md:leading-[64px] uppercase text-white">
            NOSSOS
            <br />
            PRODUTOS
          </h1>
          <span className="text-xs md:text-base text-[rgb(184,184,184)] mt-2 block">
            {ALL_PRODUCTS.length} produtos
          </span>
        </div>
        <div className="absolute hidden lg:block right-5 md:right-10 lg:right-20 bottom-0 font-sans-condensed font-black text-[100px] lg:text-[150px] text-white/[0.04] leading-none pointer-events-none select-none">
          PRODU
        </div>
      </section>

      {/* FILTROS */}
      <div className="bg-white border-b border-zinc-200 px-4 md:px-8 lg:px-[170px] py-3 md:py-4 max-w-[1440px] mx-auto flex flex-col gap-3 md:flex-row md:items-center md:gap-4">
        <div className="w-full md:flex-1 border border-zinc-500 flex items-center h-9 md:h-11 px-3 md:px-3.5 gap-2.5 md:max-w-[400px]">
          <Search size={16} className="text-zinc-500 shrink-0" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar produto..."
            className="border-none outline-none text-sm md:text-[15px] flex-1 text-brand-dark bg-transparent"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 md:flex-wrap md:gap-1 md:shrink-0">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`font-sans-condensed font-medium text-xs md:text-sm uppercase px-2 md:px-4 py-1 md:py-1.5 border transition-colors whitespace-nowrap ${
                activeCategory === cat
                  ? "bg-brand-dark text-white border-brand-dark"
                  : "bg-transparent text-zinc-500 border-zinc-200 hover:border-zinc-400"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* GRID */}
      <section className="bg-white px-4 md:px-8 lg:px-[170px] pt-6 md:pt-8 lg:pt-10 pb-10 md:pb-12 lg:pb-15 max-w-[1440px] mx-auto">
        {filtered.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-5">
            {filtered.map((p) => (
              <ProductCard key={p.id} {...p} href={`/produtos/${p.id}`} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-zinc-400 text-base">
            Nenhum produto encontrado.
          </div>
        )}
      </section>
    </div>
  );
}
