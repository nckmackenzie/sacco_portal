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
  } | null
}
