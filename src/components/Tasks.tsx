import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../utils/authHelpers.ts'
import { Todo } from '../types/Todo.ts'
import {
	createTask,
	deleteTask,
	getTasks,
	toggleTaskCompletion,
	updateTask,
} from '../services/todoService.ts'
import { TaskItem } from './TaskItem.tsx'

export const Tasks = () => {
	const { listId } = useParams<{ listId: string }>()
	const navigate = useNavigate()
	const { user } = useAuth()
	const [tasks, setTasks] = useState<Todo[]>([])
	const [newTask, setNewTask] = useState<{
		title: string
		description: string
	}>({
		title: '',
		description: '',
	})
	const [editingTask, setEditingTask] = useState<{
		id: string
		title: string
		description: string
	} | null>(null)

	useEffect(() => {
		if (!listId || !user) return

		const fetchTasks = async () => {
			const tasksData = await getTasks(listId)
			setTasks(tasksData)
		}

		fetchTasks()
	}, [listId, user])

	const handleAddTask = async () => {
		if (!newTask.title.trim() || !user || !listId) return

		const newTaskData = await createTask(
			listId,
			newTask.title,
			newTask.description
		)
		setTasks(prevTasks => [...prevTasks, newTaskData])
		setNewTask({ title: '', description: '' })
	}

	const handleDeleteTask = async (id: string) => {
		if (!user || !listId) return

		await deleteTask(listId, id)
		setTasks(prevTasks => prevTasks.filter(task => task.id !== id))
	}

	const handleEditTask = async () => {
		if (!editingTask || !editingTask.title.trim() || !user || !listId) return

		await updateTask(listId, editingTask.id, {
			title: editingTask.title,
			description: editingTask.description,
		})
		setTasks(prevTasks =>
			prevTasks.map(task =>
				task.id === editingTask.id
					? {
							...task,
							title: editingTask.title,
							description: editingTask.description,
					  }
					: task
			)
		)
		setEditingTask(null)
	}

	const handleToggleComplete = async (id: string, completed: boolean) => {
		if (!user || !listId) return

		await toggleTaskCompletion(listId, id, completed)
		setTasks(prevTasks =>
			prevTasks.map(task =>
				task.id === id ? { ...task, completed: !completed } : task
			)
		)
	}

	return (
		<div className='container mx-auto p-4'>
			<button onClick={() => navigate('/')} className='mb-4 text-blue-500'>
				← Назад до списків
			</button>
			<h1 className='text-2xl font-bold mb-4'>Завдання</h1>

			<div className='flex gap-2 mb-4'>
				<input
					type='text'
					placeholder='Назва завдання'
					className='p-2 border rounded flex-1'
					value={newTask.title}
					onChange={e => setNewTask({ ...newTask, title: e.target.value })}
				/>
				<input
					type='text'
					placeholder='Опис завдання'
					className='p-2 border rounded flex-1'
					value={newTask.description}
					onChange={e =>
						setNewTask({ ...newTask, description: e.target.value })
					}
				/>
				<button
					onClick={handleAddTask}
					className='bg-blue-500 text-white p-2 rounded'
				>
					Додати
				</button>
			</div>

			<ul className='space-y-2'>
				{tasks.map(task => (
					<TaskItem
						key={task.id}
						task={task}
						handleToggleComplete={handleToggleComplete}
						handleEditTask={handleEditTask}
						handleDeleteTask={handleDeleteTask}
						setEditingTask={setEditingTask}
						editingTask={editingTask}
					/>
				))}
			</ul>
		</div>
	)
}
