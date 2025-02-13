import { TodoList } from '../types/TodoList.ts'
import { db } from '../utils/firebaseConfig.ts'
import {
	collection,
	addDoc,
	getDocs,
	doc,
	updateDoc,
	deleteDoc,
	query,
} from 'firebase/firestore'

export const getTodoLists = async (userId: string): Promise<TodoList[]> => {
	const q = query(collection(db, 'users', userId, 'todoLists'))
	const querySnapshot = await getDocs(q)
	return querySnapshot.docs.map(doc => ({
		id: doc.id,
		...doc.data(),
	})) as TodoList[]
}

export const createTodoList = async (
	title: string,
	userId: string
): Promise<TodoList> => {
	const todoListsRef = collection(db, 'users', userId, 'todoLists')
	const docRef = await addDoc(todoListsRef, { title, userId })
	return { id: docRef.id, title, userId }
}

export const updateTodoList = async (
	userId: string,
	todoListId: string,
	title: string
): Promise<void> => {
	await updateDoc(doc(db, 'users', userId, 'todoLists', todoListId), { title })
}

export const deleteTodoList = async (
	userId: string,
	todoListId: string
): Promise<void> => {
	await deleteDoc(doc(db, 'users', userId, 'todoLists', todoListId))
}
