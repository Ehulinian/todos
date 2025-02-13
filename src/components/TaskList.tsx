import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
	collection,
	addDoc,
	deleteDoc,
	doc,
	onSnapshot,
	updateDoc,
} from 'firebase/firestore'
import { db } from '../utils/firebaseConfig.ts'
import { Todo } from '../types/Todo.ts'
import { useAuth } from '../utils/authHelpers.ts'

export const Tasks = () => {
	const { listId } = useParams<{ listId: string }>()
	const navigate = useNavigate()
	const { user } = useAuth()
	const [tasks, setTasks] = useState<Todo[]>([])
	const [newTask, setNewTask] = useState<{ name: string; description: string }>(
		{
			name: '',
			description: '',
		}
	)
	const [editingTask, setEditingTask] = useState<{
		id: string
		name: string
		description: string
	} | null>(null)

	useEffect(() => {
		if (!listId || !user) return

		const tasksRef = collection(db, `users/${user.uid}/lists/${listId}/tasks`)
		const unsubscribe = onSnapshot(tasksRef, snapshot => {
			const tasksData = snapshot.docs.map(doc => ({
				id: doc.id,
				...doc.data(),
			})) as Todo[]
			setTasks(tasksData)
		})

		return () => unsubscribe()
	}, [listId, user])

	const handleAddTask = async () => {
		if (!newTask.name.trim() || !user || !listId) return

		await addDoc(collection(db, `users/${user.uid}/lists/${listId}/tasks`), {
			name: newTask.name,
			description: newTask.description,
			completed: false,
		})
		setNewTask({ name: '', description: '' })
	}

	const handleDeleteTask = async (id: string) => {
		if (!user || !listId) return

		await deleteDoc(doc(db, `users/${user.uid}/lists/${listId}/tasks`, id))
	}

	const handleEditTask = async () => {
		if (!editingTask || !editingTask.name.trim() || !user || !listId) return

		await updateDoc(
			doc(db, `users/${user.uid}/lists/${listId}/tasks`, editingTask.id),
			{
				name: editingTask.name,
				description: editingTask.description,
			}
		)
		setEditingTask(null)
	}

	const handleToggleComplete = async (id: string, completed: boolean) => {
		if (!user || !listId) return

		await updateDoc(doc(db, `users/${user.uid}/lists/${listId}/tasks`, id), {
			completed: !completed,
		})
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
					value={newTask.name}
					onChange={e => setNewTask({ ...newTask, name: e.target.value })}
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
					<li
						key={task.id}
						className='flex justify-between items-center bg-gray-100 p-2 rounded'
					>
						<div>
							<input
								type='checkbox'
								checked={task.completed}
								onChange={() => handleToggleComplete(task.id, task.completed)}
								className='mr-2'
							/>
							{editingTask?.id === task.id ? (
								<>
									<input
										type='text'
										value={editingTask.name}
										onChange={e =>
											setEditingTask({ ...editingTask, name: e.target.value })
										}
										className='p-2 border rounded flex-1'
									/>
									<input
										type='text'
										value={editingTask.description}
										onChange={e =>
											setEditingTask({
												...editingTask,
												description: e.target.value,
											})
										}
										className='p-2 border rounded flex-1'
									/>
								</>
							) : (
								<span className={task.completed ? 'line-through' : ''}>
									{task.name}
								</span>
							)}
						</div>
						<div className='flex gap-2'>
							{editingTask?.id === task.id ? (
								<button
									onClick={handleEditTask}
									className='bg-green-500 text-white p-2 rounded'
								>
									Зберегти
								</button>
							) : (
								<button
									onClick={() => setEditingTask(task)}
									className='bg-yellow-500 text-white p-2 rounded'
								>
									Редагувати
								</button>
							)}
							<button
								onClick={() => handleDeleteTask(task.id)}
								className='bg-red-500 text-white p-2 rounded'
							>
								Видалити
							</button>
						</div>
					</li>
				))}
			</ul>
		</div>
	)
}
