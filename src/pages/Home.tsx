import { useEffect, useState } from 'react'

import { Todo } from '../types/Todo.ts'
import { useAuth } from '../utils/authHelpers.ts'
import {
	createTodoList,
	deleteTodoList,
	getTodoLists,
} from '../services/todosService.ts'

export const Home = () => {
	const { user, logout } = useAuth()
	const [todoLists, setTodoLists] = useState<Todo[]>([])
	const [newListTitle, setNewListTitle] = useState('')

	useEffect(() => {
		const fetchLists = async () => {
			const lists = await getTodoLists()
			setTodoLists(lists)
		}
		fetchLists()
	}, [])

	const handleCreateList = async () => {
		if (!newListTitle) return
		await createTodoList(newListTitle, user!.uid)
		setNewListTitle('')
		const updatedLists = await getTodoLists()
		setTodoLists(updatedLists)
	}

	const handleDeleteList = async (id: string) => {
		await deleteTodoList(id)
		setTodoLists(todoLists.filter(list => list.id !== id))
	}

	return (
		<div className='flex flex-col items-center mt-10'>
			<h1 className='text-2xl font-bold'>Головна</h1>
			<p className='mt-2'>Ласкаво просимо, {user?.email}!</p>

			<div className='mt-5 flex gap-2'>
				<input
					type='text'
					placeholder='Назва списку'
					className='p-2 border rounded'
					value={newListTitle}
					onChange={e => setNewListTitle(e.target.value)}
				/>
				<button
					onClick={handleCreateList}
					className='bg-green-500 text-white p-2 rounded'
				>
					Додати список
				</button>
			</div>

			<ul className='mt-5 w-1/2'>
				{todoLists.map(list => (
					<li key={list.id} className='flex justify-between p-2 border-b'>
						<span>{list.title}</span>
						<button
							onClick={() => handleDeleteList(list.id)}
							className='text-red-500'
						>
							×
						</button>
					</li>
				))}
			</ul>

			<button
				onClick={logout}
				className='mt-5 bg-red-500 text-white p-2 rounded'
			>
				Вийти
			</button>
		</div>
	)
}
