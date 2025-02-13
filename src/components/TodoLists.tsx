import { TodoList } from '../types/TodoList'
import { TodoListItem } from './TodoListItem'

type TodoListsProps = {
	todoLists: TodoList[]
	onEdit: (id: string, title: string) => void
	onDelete: (id: string) => void
	onSaveEdit: (id: string, title: string) => void
	editListId: string | null
	editListTitle: string | null
	setEditListId: (id: string | null) => void
	setEditListTitle: (title: string | null) => void
}

export const TodoLists: React.FC<TodoListsProps> = ({
	todoLists,
	onEdit,
	onDelete,
	onSaveEdit,
	editListId,
	editListTitle,
	setEditListId,
	setEditListTitle,
}) => {
	return (
		<ul className='mt-5 w-1/2'>
			{todoLists.map(list => (
				<TodoListItem
					key={list.id}
					list={list}
					editListId={editListId}
					editListTitle={editListTitle}
					onEdit={onEdit}
					onDelete={onDelete}
					onSaveEdit={onSaveEdit}
					setEditListId={setEditListId}
					setEditListTitle={setEditListTitle}
				/>
			))}
		</ul>
	)
}
