import { TodoList } from '../types/TodoList.ts'
import { db } from '../utils/firebaseConfig.ts'
import {
	collection,
	addDoc,
	getDocs,
	doc,
	updateDoc,
	deleteDoc,
} from 'firebase/firestore'

export const getTodoLists = async (): Promise<TodoList[]> => {
	const querySnapshot = await getDocs(collection(db, 'todoLists'))
	return querySnapshot.docs.map(doc => ({
		id: doc.id,
		...doc.data(),
	})) as TodoList[]
}

export const createTodoList = async (
	title: string,
	userId: string
): Promise<TodoList> => {
	const docRef = await addDoc(collection(db, 'todoLists'), { title, userId })
	return { id: docRef.id, title, userId }
}

export const updateTodoList = async (
	id: string,
	title: string
): Promise<void> => {
	await updateDoc(doc(db, 'todoLists', id), { title })
}

export const deleteTodoList = async (id: string): Promise<void> => {
	await deleteDoc(doc(db, 'todoLists', id))
}
