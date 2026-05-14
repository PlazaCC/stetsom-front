import { FileText, Mail, MapPin, MessageCircle, Phone } from 'lucide-react'

export const CARD_ICONS = {
  'central-ajuda': FileText,
  garantia: MapPin,
  manuais: MessageCircle,
} as const

export const CONTACT_DETAILS = [
  {
    id: 'address',
    icon: MapPin,
    label: 'Endereço',
    value: 'Av. Industrial Stetsom, 100 — São Paulo, SP 09850-000',
  },
  { id: 'email', icon: Mail, label: 'E-mail', value: 'suporte@stetsom.com.br' },
  { id: 'phone', icon: Phone, label: 'Telefone', value: '+55 (11) 3000-0000' },
] as const
