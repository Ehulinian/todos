import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../utils/authHelpers'

export const LogoutButton = () => {
	const { logout } = useAuth()
	const navigate = useNavigate()

	const handleLogout = async () => {
		await logout()
		navigate('/login')
	}

	return (
		<button
			onClick={handleLogout}
			className='mt-4 bg-red-500 text-white p-2 rounded'
		>
			Вийти
		</button>
	)
}
