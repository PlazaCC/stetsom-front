import { Button } from '@/components/ui/button'

export function ContactForm() {
  return (
    <form className='max-w-120 space-y-6'>
      <div>
        <label htmlFor='name' className='block text-sm font-medium text-foreground mb-2'>
          Nome
        </label>
        <input
          type='text'
          id='name'
          name='name'
          className='w-full px-4 py-3 border border-zinc-300 rounded focus:outline-none focus:ring-2 focus:ring-brand'
        />
      </div>
      <div>
        <label htmlFor='email' className='block text-sm font-medium text-foreground mb-2'>
          Email
        </label>
        <input
          type='email'
          id='email'
          name='email'
          className='w-full px-4 py-3 border border-zinc-300 rounded focus:outline-none focus:ring-2 focus:ring-brand'
        />
      </div>
      <div>
        <label htmlFor='message' className='block text-sm font-medium text-foreground mb-2'>
          Mensagem
        </label>
        <textarea
          id='message'
          name='message'
          rows={5}
          className='w-full px-4 py-3 border border-zinc-300 rounded focus:outline-none focus:ring-2 focus:ring-brand'
        />
      </div>
      <Button variant='brand'>Enviar Mensagem</Button>
    </form>
  )
}
