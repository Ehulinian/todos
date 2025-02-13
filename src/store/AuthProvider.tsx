import { useState, useEffect } from 'react'
import { AuthContext } from './AuthContext'
import { User } from '../types/User'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../utils/firebaseConfig'

type Props = {
	children: React.ReactNode
}

export const AuthProvider: React.FC<Props> = ({ children }) => {
	const [user, setUser] = useState<User | null>(null)
	const [role, setRole] = useState<'admin' | 'viewer' | undefined>(undefined)

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, firebaseUser => {
			if (firebaseUser) {
				setUser({
					id: firebaseUser.uid,
					email: firebaseUser.email!,
					role: 'viewer',
				})
			} else {
				setUser(null)
			}
		})
		return () => unsubscribe()
	}, [])

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
