import { FileText, Mail, MapPin, MessageCircle, Phone } from 'lucide-react'

export const CARD_ICONS = {
  'central-ajuda': FileText,
  garantia: MapPin,
  manuais: MessageCircle,
} as const

export const AUTHORIZED_POSTS = [
  {
    id: 'sp-1',
    type: 'Distribuidor',
    name: 'Stetsom São Paulo',
    address: 'Rua Augusta, 1200 — São Paulo, SP',
    phone: '(11) 3000-0000',
  },
  {
    id: 'rj-1',
    type: 'Distribuidor',
    name: 'Stetsom Rio de Janeiro',
    address: 'Av. Brasil, 500 — Rio de Janeiro, RJ',
    phone: '(21) 3000-0000',
  },
  {
    id: 'mg-1',
    type: 'Distribuidor',
    name: 'Stetsom Belo Horizonte',
    address: 'Av. Amazonas, 300 — Belo Horizonte, MG',
    phone: '(31) 3000-0000',
  },
  {
    id: 'rs-1',
    type: 'Distribuidor',
    name: 'Stetsom Porto Alegre',
    address: 'Av. Ipiranga, 800 — Porto Alegre, RS',
    phone: '(51) 3000-0000',
  },
] as const

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
