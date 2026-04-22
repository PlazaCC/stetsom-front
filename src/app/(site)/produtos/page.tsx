"use client"

import { useState } from "react"
import Image from "next/image"
import { Search } from "lucide-react"
import ProductCard from "@/components/ui/product-card"

const ALL_PRODUCTS = [
  { id: 1, name: "ST-4000EQ 4 CANAIS", category: "Amplificador", spec: "4x 1000W RMS", badge: "Novo", img: "/product-image.png" },
  { id: 2, name: "ST-2000EQ MONO", category: "Módulo", spec: "1x 2000W RMS", badge: null, img: "/product-image.png" },
  { id: 3, name: "ST-800.4 COMPACT", category: "Amplificador", spec: "4x 200W RMS", badge: "Oferta", img: "/product-image-2.png" },
  { id: 4, name: "ST-1200.1D BASS", category: "Módulo", spec: "1x 1200W RMS", badge: null, img: "/product-image-2.png" },
  { id: 5, name: "ST-600.4 ULTRA", category: "Amplificador", spec: "4x 150W RMS", badge: null, img: "/product-image.png" },
  { id: 6, name: "ST-350.4 MINI", category: "Amplificador", spec: "4x 87W RMS", badge: null, img: "/product-image-2.png" },
]

const CATEGORIES = ["Todos", "Amplificadores", "Módulos", "Subwoofers", "Acessórios"]

export default function ProdutosPage() {
  const [activeCategory, setActiveCategory] = useState("Todos")
  const [search, setSearch] = useState("")

  const filtered = ALL_PRODUCTS.filter((p) => {
    const matchCat =
      activeCategory === "Todos" ||
      p.category.toLowerCase().includes(activeCategory.toLowerCase().slice(0, -1))
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  return (
    <div>
      {/* HERO */}
      <section className="relative bg-[rgb(9,9,11)] overflow-hidden h-[357px]">
        <Image
          src="/produtos-hero.png"
          alt=""
          fill
          className="object-cover opacity-40"
          priority
        />
        <div className="relative z-10 pt-[103px] px-8 lg:px-[170px] max-w-[1440px] mx-auto">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-6 h-px bg-brand shrink-0" />
            <span className="font-sans-condensed font-medium text-base uppercase text-brand">
              CATÁLOGO COMPLETO
            </span>
          </div>
          <h1 className="font-sans-condensed font-black text-[60px] leading-[64px] uppercase text-white">
            NOSSOS
            <br />
            PRODUTOS
          </h1>
          <span className="text-base text-[rgb(184,184,184)] mt-2 block">
            {ALL_PRODUCTS.length} produtos
          </span>
        </div>
        <div className="absolute right-20 bottom-0 font-sans-condensed font-black text-[150px] text-white/[0.04] leading-none pointer-events-none select-none">
          PRODU
        </div>
      </section>

      {/* FILTROS */}
      <div className="bg-white border-b border-zinc-200 px-8 lg:px-[170px] py-3 max-w-[1440px] mx-auto flex gap-4 items-center">
        <div className="flex-1 border border-zinc-500 flex items-center h-11 px-3.5 gap-2.5 max-w-[400px]">
          <Search size={16} className="text-zinc-500 shrink-0" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar produto..."
            className="border-none outline-none text-[15px] flex-1 text-brand-dark bg-transparent"
          />
        </div>
        <div className="flex gap-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`font-sans-condensed font-medium text-sm uppercase px-4 py-1.5 border transition-colors ${
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
      <section className="bg-white px-8 lg:px-[170px] pt-10 pb-15 max-w-[1440px] mx-auto">
        {filtered.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
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
  )
}
