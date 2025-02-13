import { useEffect, useState } from 'react'
import { useAuth } from '../utils/authHelpers.ts'
import {
	createTodoList,
	deleteTodoList,
	getTodoLists,
	updateTodoList,
} from '../services/todosService.ts'
import { TodoList } from '../types/TodoList.ts'
import { CreateListForm } from '../components/CreateListForm.tsx'
import { TodoLists } from '../components/TodoLists.tsx'
import { LogoutButton } from '../components/UI/LogoutButton.tsx'

export const Home = () => {
	const { user } = useAuth()
	const [todoLists, setTodoLists] = useState<TodoList[]>([])
	const [editListTitle, setEditListTitle] = useState<string | null>(null)
	const [editListId, setEditListId] = useState<string | null>(null)

	useEffect(() => {
		const fetchLists = async () => {
			if (user) {
				const lists = await getTodoLists(user!.uid)
				setTodoLists(lists)
			}
		}
		fetchLists()
	}, [user])

	const handleCreateList = async (newListTitle: string) => {
		if (!user) return
		await createTodoList(newListTitle, user!.uid)
		const updatedLists = await getTodoLists(user!.uid)
		setTodoLists(updatedLists)
	}

	const handleDeleteList = async (id: string) => {
		await deleteTodoList(id)
		const updatedLists = await getTodoLists(user!.uid)
		setTodoLists(updatedLists)
	}

	const handleEditList = (id: string, title: string) => {
		setEditListId(id)
		setEditListTitle(title)
	}

	const handleSaveEdit = async () => {
		if (!editListTitle || !editListId) return
		await updateTodoList(editListId, editListTitle)
		const updatedLists = await getTodoLists(user!.uid)
		setTodoLists(updatedLists)
		setEditListId(null)
		setEditListTitle('')
	}

	return (
		<div className='flex flex-col items-center mt-10'>
			<h1 className='text-2xl font-bold'>Головна</h1>
			<p className='mt-2'>Ласкаво просимо, {user?.email}!</p>

			<CreateListForm onCreate={handleCreateList} />

			<TodoLists
				todoLists={todoLists}
				onEdit={handleEditList}
				onDelete={handleDeleteList}
				onSaveEdit={handleSaveEdit}
				editListId={editListId}
				editListTitle={editListTitle}
				setEditListId={setEditListId}
				setEditListTitle={setEditListTitle}
			/>

			<LogoutButton />
		</div>
	)
}
