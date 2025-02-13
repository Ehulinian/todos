import { createContext } from 'react'
import { User } from '../types/User'

type AuthContextType = {
	user: User | null
	role?: 'admin' | 'viewer'
	login: (user: User) => void
	logout: () => void
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)
