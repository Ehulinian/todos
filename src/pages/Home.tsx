import { useEffect, useState } from 'react'
import { useAuth } from '../utils/authHelpers.ts'
import {
	createTodoList,
	deleteTodoList,
	getTodoLists,
	updateTodoList,
} from '../services/todosService.ts'
import { TodoList } from '../types/TodoList.ts'
import { Link } from 'react-router-dom'

export const Home = () => {
	const { user, logout } = useAuth()
	const [todoLists, setTodoLists] = useState<TodoList[]>([])
	const [newListTitle, setNewListTitle] = useState('')
	const [editListTitle, setEditListTitle] = useState<string | null>(null)
	const [editListId, setEditListId] = useState<string | null>(null)

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

	const handleEditList = (id: string, title: string) => {
		setEditListId(id)
		setEditListTitle(title)
	}

	const handleSaveEdit = async () => {
		if (!editListTitle || !editListId) return
		await updateTodoList(editListId, editListTitle)
		const updatedLists = await getTodoLists()
		setTodoLists(updatedLists)
		setEditListId(null)
		setEditListTitle('')
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
						{editListId === list.id ? (
							<div className='flex gap-2'>
								<input
									type='text'
									value={editListTitle || ''}
									onChange={e => setEditListTitle(e.target.value)}
									className='p-2 border rounded'
								/>
								<button
									onClick={handleSaveEdit}
									className='bg-blue-500 text-white p-2 rounded'
								>
									Зберегти
								</button>
								<button
									onClick={() => {
										setEditListId(null)
										setEditListTitle('')
									}}
									className='bg-gray-500 text-white p-2 rounded'
								>
									Скасувати
								</button>
							</div>
						) : (
							<>
								<Link to={`/list/${list.id}`}>
									<span>{list.title}</span>
								</Link>
								<button
									onClick={() => handleEditList(list.id, list.title)}
									className='text-blue-500'
								>
									Редагувати
								</button>
								<button
									onClick={() => handleDeleteList(list.id)}
									className='text-red-500'
								>
									×
								</button>
							</>
						)}
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
