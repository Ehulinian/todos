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
import { addCollaborator, getCollaborators } from '../services/collabService.ts'

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

	const [isModalOpen, setIsModalOpen] = useState(false)
	const [email, setEmail] = useState('')
	const [role, setRole] = useState<'admin' | 'viewer'>('viewer')
	const [collaborators, setCollaborators] = useState<
		{ email: string; role: 'admin' | 'viewer' }[]
	>([])
	const [userRole, setUserRole] = useState<'admin' | 'viewer' | null>(null)

	useEffect(() => {
		if (!listId || !user) return

		const fetchTasks = async () => {
			const tasksData = await getTasks(user.id, listId)
			setTasks(tasksData)
		}

		const fetchCollaborators = async () => {
			const collabs = await getCollaborators(listId!)
			setCollaborators(collabs)

			const currentUserRole =
				collabs.find(collab => collab.email === user.email)?.role || 'admin'
			setUserRole(currentUserRole)
		}

		fetchTasks()
		fetchCollaborators()
	}, [listId, user])

	const handleAddTask = async () => {
		if (!newTask.title.trim() || !user || !listId) return

		const newTaskData = await createTask(
			user.id,
			listId,
			newTask.title,
			newTask.description
		)
		setTasks(prevTasks => [...prevTasks, newTaskData])
		setNewTask({ title: '', description: '' })
	}

	const handleDeleteTask = async (id: string) => {
		if (!user || !listId || userRole !== 'admin') return

		await deleteTask(user.id, listId, id)
		setTasks(prevTasks => prevTasks.filter(task => task.id !== id))
	}

	const handleEditTask = async () => {
		if (!editingTask || !editingTask.title.trim() || !user || !listId) return

		await updateTask(user.id, listId, editingTask.id, {
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

		await toggleTaskCompletion(user.id, listId, id, completed)
		setTasks(prevTasks =>
			prevTasks.map(task =>
				task.id === id ? { ...task, completed: !completed } : task
			)
		)
	}

	const handleAddCollaborator = async () => {
		if (!email.trim()) return

		try {
			await addCollaborator(listId!, email, role)
			alert('Співробітника додано успішно!')
			setEmail('')
			setRole('viewer')
			setIsModalOpen(false)
			const collabs = await getCollaborators(listId!)
			setCollaborators(collabs)
		} catch (error) {
			console.error('Помилка при додаванні співробітника:', error)
			alert('Щось пішло не так!')
		}
	}

	return (
		<div className='container mx-auto p-4'>
			<button onClick={() => navigate('/')} className='mb-4 text-blue-500'>
				← Назад до списків
			</button>
			<h1 className='text-2xl font-bold mb-4'>Завдання</h1>

			{userRole === 'admin' && (
				<button
					onClick={() => setIsModalOpen(true)}
					className='bg-green-500 text-white p-2 rounded mb-4'
				>
					Додати співпрацівника
				</button>
			)}

			<div className='mb-4'>
				<h2 className='text-xl font-semibold'>Співпрацівники:</h2>
				<ul>
					{collaborators.map((collaborator, index) => (
						<li key={index}>
							{collaborator.email} -{' '}
							{collaborator.role === 'admin' ? 'admin' : 'viewer'}
						</li>
					))}
				</ul>
			</div>

			{isModalOpen && (
				<div className='fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center'>
					<div className='bg-white p-4 rounded shadow-lg w-1/3'>
						<h2 className=' text-white mb-4'>Додати співпрацівника</h2>

						<div>
							<input
								type='email'
								placeholder='Email співпрацівника'
								className='p-2 border rounded w-full mb-4'
								value={email}
								onChange={e => setEmail(e.target.value)}
							/>
							<div className='mb-4'>
								<label className='mr-2'>Роль:</label>
								<select
									value={role}
									onChange={e => setRole(e.target.value as 'admin' | 'viewer')}
									className='p-2 border rounded'
								>
									<option value='viewer'>Переглядач</option>
									<option value='admin'>Адміністратор</option>
								</select>
							</div>
							<div className='flex justify-between'>
								<button
									onClick={handleAddCollaborator}
									className='bg-blue-500 text-white p-2 rounded'
								>
									Додати
								</button>
								<button
									onClick={() => setIsModalOpen(false)}
									className='bg-red-500 text-white p-2 rounded'
								>
									Закрити
								</button>
							</div>
						</div>
					</div>
				</div>
			)}

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
						canEdit={userRole === 'admin'}
						canDelete={userRole === 'admin'}
					/>
				))}
			</ul>
		</div>
	)
}
