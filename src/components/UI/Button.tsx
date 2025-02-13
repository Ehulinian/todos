import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../utils/authHelpers'

export const Home = () => {
	const { user, logout } = useAuth()
	const navigate = useNavigate()

	const handleLogout = async () => {
		await logout()
		navigate('/login')
	}

	return (
		<div className='flex flex-col items-center mt-10'>
			<h1 className='text-2xl font-bold'>Головна</h1>
			<p className='mt-2'>Ласкаво просимо, {user?.email}!</p>
			<button
				onClick={handleLogout}
				className='mt-4 bg-red-500 text-white p-2 rounded'
			>
				Вийти
			</button>
		</div>
	)
}
