export type UserType = 'admin' | 'user'

export interface User {
  id: number
  contact: string
  name: string
  email: string | null
  userType: UserType
  member: {
    photo: string | null
    registrationDate: Date
    memberNo: number
    alternateNo: string | null
  } | null
}

export type PaymentMethod = 'cash' | 'mpesa' | 'cheque' | 'bank'
export interface WithId {
  id: string
}

export interface Option {
  value: string
  label: string
}

export interface Notification extends WithId {
  title: string
  message: string
  path: string
  isRead: boolean
  createdAt: Date
}

export interface Pagination {
  total: number
  perPage: number
  currentPage: number
  lastPage: number
  from: number
  to: number
}
