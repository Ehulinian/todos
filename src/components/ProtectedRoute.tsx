import { Navigate } from 'react-router-dom'
import { useAuth } from '../utils/authHelpers'

type Props = {
	children: React.ReactNode
	requiredRole?: 'admin' | 'viewer'
}

export const ProtectedRoute: React.FC<Props> = ({ children, requiredRole }) => {
	const { user, role } = useAuth()

	if (!user) return <Navigate to='/login' />
	if (requiredRole && role !== requiredRole) return <p>Недостатньо прав</p>

	return <>{children}</>
}
