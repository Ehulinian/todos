import { Todo } from '../types/Todo.ts'
import { db } from '../utils/firebaseConfig.ts'
import {
	collection,
	addDoc,
	getDocs,
	doc,
	updateDoc,
	deleteDoc,
} from 'firebase/firestore'

export const getTasks = async (listId: string): Promise<Todo[]> => {
	const querySnapshot = await getDocs(
		collection(db, `todoLists/${listId}/tasks`)
	)
	return querySnapshot.docs.map(doc => ({
		id: doc.id,
		...doc.data(),
	})) as Todo[]
}

export const createTask = async (
	listId: string,
	title: string,
	description: string
): Promise<Todo> => {
	const docRef = await addDoc(collection(db, `todoLists/${listId}/tasks`), {
		title,
		description,
		completed: false,
	})
	return { id: docRef.id, title, description, completed: false }
}

export const updateTask = async (
	listId: string,
	taskId: string,
	updates: Partial<Todo>
): Promise<void> => {
	await updateDoc(doc(db, `todoLists/${listId}/tasks`, taskId), updates)
}

export const deleteTask = async (
	listId: string,
	taskId: string
): Promise<void> => {
	await deleteDoc(doc(db, `todoLists/${listId}/tasks`, taskId))
}

export const toggleTaskCompletion = async (
	listId: string,
	taskId: string,
	completed: boolean
): Promise<void> => {
	await updateDoc(doc(db, `todoLists/${listId}/tasks`, taskId), {
		completed: !completed,
	})
}
