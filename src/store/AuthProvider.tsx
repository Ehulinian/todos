import { useState } from 'react'
import { AuthContext } from './AuthContext'
import { User } from '../types/User'

type Props = {
	children: React.ReactNode
}

export const AuthProvider: React.FC<Props> = ({ children }) => {
	const [user, setUser] = useState<User | null>(null)
	const [role, setRole] = useState<'admin' | 'viewer' | undefined>(undefined)

	const login = (user: User) => {
		setUser(user)
		setRole('viewer')
	}

	const logout = () => {
		setUser(null)
		setRole(undefined)
	}

	return (
		<AuthContext.Provider value={{ user, role, login, logout }}>
			{children}
		</AuthContext.Provider>
	)
}
