import { useState } from 'react'

type CreateListFormProps = {
	onCreate: (title: string) => void
}

export const CreateListForm: React.FC<CreateListFormProps> = ({ onCreate }) => {
	const [newListTitle, setNewListTitle] = useState('')

	const handleCreateList = () => {
		if (newListTitle.trim()) {
			onCreate(newListTitle)
			setNewListTitle('')
		}
	}

	return (
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
	)
}
