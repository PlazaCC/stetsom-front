'use client'

import { Button } from '@/components/ui/button'
import { useState } from 'react'

export function ContactForm() {
  const [sent, setSent] = useState(false)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSent(true)
  }

  if (sent) {
    return (
      <div className='max-w-120 rounded border border-border bg-off-white p-8 text-center'>
        <p className='font-sans-condensed text-section-title font-black uppercase text-brand-dark'>Mensagem enviada!</p>
        <p className='mt-2 text-sm text-text-subtle'>Em breve entraremos em contato.</p>
        <button
          type='button'
          onClick={() => setSent(false)}
          className='mt-4 font-sans text-sm text-brand underline underline-offset-2'>
          Enviar outra mensagem
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className='max-w-120 space-y-6'>
      <div>
        <label htmlFor='name' className='mb-2 block text-sm font-medium text-foreground'>
          Nome
        </label>
        <input
          type='text'
          id='name'
          name='name'
          required
          className='w-full rounded border border-border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand'
        />
      </div>
      <div>
        <label htmlFor='email' className='mb-2 block text-sm font-medium text-foreground'>
          Email
        </label>
        <input
          type='email'
          id='email'
          name='email'
          required
          className='w-full rounded border border-border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand'
        />
      </div>
      <div>
        <label htmlFor='message' className='mb-2 block text-sm font-medium text-foreground'>
          Mensagem
        </label>
        <textarea
          id='message'
          name='message'
          rows={5}
          required
          className='w-full rounded border border-border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand'
        />
      </div>
      <Button type='submit' variant='brand'>
        Enviar Mensagem
      </Button>
    </form>
  )
}
