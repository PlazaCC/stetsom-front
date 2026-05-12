'use client'

import { useCmsProducts } from '@/hooks/use-cms'
import type { ProductStatus } from '@/lib/api/contracts'
import { useMemo, useState } from 'react'

type ProductOverride = {
  name: string
  status: ProductStatus
}

export default function CMSHome() {
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'ALL' | ProductStatus>('ALL')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [draftName, setDraftName] = useState('')
  const [draftStatus, setDraftStatus] = useState<ProductStatus>('ACTIVE')
  const [overrides, setOverrides] = useState<Record<string, ProductOverride>>({})

  const cmsProducts = useCmsProducts({
    q: query || undefined,
    status: statusFilter,
    page: 1,
    pageSize: 24,
  })

  const rows = useMemo(() => {
    const items = cmsProducts.data?.items ?? []

    return items.map((item) => {
      const override = overrides[item.id]
      return {
        ...item,
        name: override?.name ?? item.name,
        status: override?.status ?? item.status,
      }
    })
  }, [cmsProducts.data?.items, overrides])

  function startEdit(id: string, name: string, status: ProductStatus) {
    setEditingId(id)
    setDraftName(name)
    setDraftStatus(status)
  }

  function cancelEdit() {
    setEditingId(null)
    setDraftName('')
    setDraftStatus('ACTIVE')
  }

  function saveEdit(id: string) {
    setOverrides((current) => ({
      ...current,
      [id]: {
        name: draftName,
        status: draftStatus,
      },
    }))

    cancelEdit()
  }

  if (cmsProducts.isLoading) {
    return <div className='text-zinc-500'>Carregando produtos do CMS...</div>
  }

  if (cmsProducts.isError || !cmsProducts.data) {
    return <div className='text-red-600'>Nao foi possivel carregar o CMS.</div>
  }

  return (
    <div className='space-y-6'>
      <header>
        <h1 className='font-sans-condensed text-4xl font-black uppercase text-brand-dark'>{cmsProducts.data.title}</h1>
        <p className='mt-2 text-sm text-zinc-500'>{cmsProducts.data.subtitle}</p>
      </header>

      <section className='flex flex-col gap-3 rounded-md border border-zinc-200 bg-white p-4 md:flex-row md:items-center'>
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder='Buscar por nome ou slug'
          className='h-10 w-full rounded border border-zinc-300 px-3 text-sm outline-none md:max-w-90'
        />

        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value as 'ALL' | ProductStatus)}
          className='h-10 rounded border border-zinc-300 px-3 text-sm outline-none'>
          <option value='ALL'>Todos os status</option>
          <option value='ACTIVE'>Ativo</option>
          <option value='DISCONTINUED'>Descontinuado</option>
        </select>

        <span className='text-xs uppercase text-zinc-500 md:ml-auto'>{cmsProducts.data.total} itens</span>
      </section>

      <section className='overflow-hidden rounded-md border border-zinc-200 bg-white'>
        <table className='w-full text-left text-sm'>
          <thead className='bg-zinc-50 text-xs uppercase text-zinc-500'>
            <tr>
              <th className='px-4 py-3'>Nome</th>
              <th className='px-4 py-3'>Categoria</th>
              <th className='px-4 py-3'>Status</th>
              <th className='px-4 py-3'>Atualizado em</th>
              <th className='px-4 py-3 text-right'>Acoes</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const isEditing = editingId === row.id

              return (
                <tr key={row.id} className='border-t border-zinc-100'>
                  <td className='px-4 py-3'>
                    {isEditing ? (
                      <input
                        value={draftName}
                        onChange={(event) => setDraftName(event.target.value)}
                        className='h-9 w-full rounded border border-zinc-300 px-2 text-sm outline-none'
                      />
                    ) : (
                      <p className='font-medium text-brand-dark'>{row.name}</p>
                    )}
                  </td>
                  <td className='px-4 py-3 text-zinc-600'>{row.category}</td>
                  <td className='px-4 py-3'>
                    {isEditing ? (
                      <select
                        value={draftStatus}
                        onChange={(event) => setDraftStatus(event.target.value as ProductStatus)}
                        className='h-9 rounded border border-zinc-300 px-2 text-sm outline-none'>
                        <option value='ACTIVE'>Ativo</option>
                        <option value='DISCONTINUED'>Descontinuado</option>
                      </select>
                    ) : (
                      <span
                        className={
                          row.status === 'ACTIVE'
                            ? 'rounded-full bg-emerald-50 px-2 py-1 text-xs text-emerald-700'
                            : 'rounded-full bg-amber-50 px-2 py-1 text-xs text-amber-700'
                        }>
                        {row.status}
                      </span>
                    )}
                  </td>
                  <td className='px-4 py-3 text-zinc-500'>{row.updated_at}</td>
                  <td className='px-4 py-3 text-right'>
                    {isEditing ? (
                      <div className='inline-flex gap-2'>
                        <button
                          onClick={() => saveEdit(row.id)}
                          className='rounded bg-brand px-3 py-1.5 text-xs font-semibold uppercase text-white'>
                          Salvar
                        </button>
                        <button
                          onClick={cancelEdit}
                          className='rounded border border-zinc-300 px-3 py-1.5 text-xs font-semibold uppercase text-zinc-600'>
                          Cancelar
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => startEdit(row.id, row.name, row.status)}
                        className='rounded border border-zinc-300 px-3 py-1.5 text-xs font-semibold uppercase text-zinc-700'>
                        Editar
                      </button>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </section>
    </div>
  )
}
