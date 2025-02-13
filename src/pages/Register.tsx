import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../utils/firebaseConfig.ts'

export const Register = () => {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [error, setError] = useState('')
	const navigate = useNavigate()

	const handleRegister = async (e: React.FormEvent) => {
		e.preventDefault()
		setError('')

		try {
			await createUserWithEmailAndPassword(auth, email, password)
			navigate('/login')
		} catch (err) {
			setError('Something went wrong')
			throw err
		}
	}

	return (
		<div className='flex flex-col items-center mt-10'>
			<h2 className='text-2xl font-bold'>Реєстрація</h2>
			{error && <p className='text-red-500 mt-2'>{error}</p>}
			<form onSubmit={handleRegister} className='mt-4 flex flex-col gap-3'>
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
					Зареєструватися
				</button>
			</form>
			<p className='mt-4'>
				Вже маєте акаунт?{' '}
				<a href='/login' className='text-blue-500'>
					Увійдіть
				</a>
			</p>
		</div>
	)
}
