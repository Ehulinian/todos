// src/components/TodoListItem.tsx
import { Link } from 'react-router-dom'

type TodoListItemProps = {
	list: {
		id: string
		title: string
	}
	editListId: string | null
	editListTitle: string | null
	onEdit: (id: string, title: string) => void
	onDelete: (id: string) => void
	onSaveEdit: (id: string, title: string) => void // Функція, яка приймає два аргументи
	setEditListId: (id: string | null) => void
	setEditListTitle: (title: string | null) => void
}

export const TodoListItem: React.FC<TodoListItemProps> = ({
	list,
	editListId,
	editListTitle,
	onEdit,
	onDelete,
	onSaveEdit,
	setEditListId,
	setEditListTitle,
}) => {
	return (
		<li className='flex justify-between p-2 border-b'>
			{editListId === list.id ? (
				<div className='flex gap-2'>
					<input
						type='text'
						value={editListTitle || ''}
						onChange={e => setEditListTitle(e.target.value)}
						className='p-2 border rounded'
					/>
					<button
						onClick={() => onSaveEdit(list.id, editListTitle || '')} // Передаємо аргументи
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
						onClick={() => onEdit(list.id, list.title)}
						className='text-blue-500'
					>
						Редагувати
					</button>
					<button onClick={() => onDelete(list.id)} className='text-red-500'>
						×
					</button>
				</>
			)}
		</li>
	)
}
