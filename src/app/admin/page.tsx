'use client'

import { useAdminDashboard } from '@/hooks/use-admin'

export default function AdminHome() {
  const dashboard = useAdminDashboard()

  if (dashboard.isLoading) {
    return <div className='text-zinc-500'>Carregando dashboard...</div>
  }

  if (dashboard.isError || !dashboard.data) {
    return <div className='text-red-600'>Nao foi possivel carregar o dashboard.</div>
  }

  return (
    <div className='space-y-8'>
      <header>
        <h1 className='font-sans-condensed text-4xl font-black uppercase text-brand-dark'>{dashboard.data.title}</h1>
        <p className='mt-2 text-sm text-zinc-500'>{dashboard.data.subtitle}</p>
      </header>

      <section className='grid gap-4 md:grid-cols-2 xl:grid-cols-4'>
        {dashboard.data.metrics.map((metric) => (
          <article key={metric.id} className='rounded-md border border-zinc-200 bg-white p-5'>
            <p className='text-xs uppercase text-zinc-500'>{metric.label}</p>
            <p className='mt-2 font-sans-condensed text-3xl font-black text-brand-dark'>{metric.value}</p>
            {metric.variation ? <p className='mt-1 text-xs text-brand'>{metric.variation}</p> : null}
          </article>
        ))}
      </section>

      <section className='rounded-md border border-zinc-200 bg-white p-5'>
        <h2 className='font-sans-condensed text-2xl font-black uppercase text-brand-dark'>Atividades recentes</h2>

        <ul className='mt-4 space-y-4'>
          {dashboard.data.recentActivities.map((activity) => (
            <li key={activity.id} className='rounded-sm border border-zinc-100 p-4'>
              <p className='font-sans-condensed text-lg font-bold uppercase text-brand-dark'>{activity.title}</p>
              <p className='mt-1 text-sm text-zinc-600'>{activity.description}</p>
              <p className='mt-2 text-xs uppercase text-zinc-400'>{activity.timestamp}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
