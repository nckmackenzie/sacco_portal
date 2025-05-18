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
