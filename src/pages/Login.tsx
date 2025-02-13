import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../utils/firebaseConfig.ts'

export const Login = () => {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [error, setError] = useState('')
	const navigate = useNavigate()

	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault()
		setError('')

		try {
			await signInWithEmailAndPassword(auth, email, password)
			navigate('/')
		} catch (err) {
			setError('Something went wrong')
			throw err
		}
	}

	return (
		<div className='flex flex-col items-center mt-10'>
			<h2 className='text-2xl font-bold'>Вхід</h2>
			{error && <p className='text-red-500 mt-2'>{error}</p>}
			<form onSubmit={handleLogin} className='mt-4 flex flex-col gap-3'>
				<input
					type='email'
					placeholder='Email'
					className='p-2 border rounded'
					value={email}
					onChange={e => setEmail(e.target.value)}
				/>
				<input
					type='password'
					placeholder='Пароль'
					className='p-2 border rounded'
					value={password}
					onChange={e => setPassword(e.target.value)}
				/>
				<button type='submit' className='bg-blue-500 text-white p-2 rounded'>
					Увійти
				</button>
			</form>
			<p className='mt-4'>
				Немає акаунту?{' '}
				<a href='/register' className='text-blue-500'>
					Зареєструйтеся
				</a>
			</p>
		</div>
	)
}
