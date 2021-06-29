import useSWR from 'swr'
import { User } from '../types'

export const useMe = () => {
  return useSWR<User | null>('/profile/me')
}
