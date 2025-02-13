import { Todo } from '../types/Todo'

type Props = {
	task: Todo
	editingTask: {
		id: string
		title: string
		description: string
	} | null
	handleToggleComplete: (id: string, completed: boolean) => void
	setEditingTask: (
		task: {
			id: string
			title: string
			description: string
		} | null
	) => void
	handleEditTask: () => void
	handleDeleteTask: (id: string) => void
}

export const TaskItem: React.FC<Props> = ({
	task,
	editingTask,
	handleToggleComplete,
	setEditingTask,
	handleEditTask,
	handleDeleteTask,
}) => {
	return (
		<li className='flex justify-between items-center bg-gray-100 p-2 rounded'>
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
							value={editingTask.title}
							onChange={e =>
								setEditingTask({ ...editingTask, title: e.target.value })
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
						{task.title} - {task.description}{' '}
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
	)
}
