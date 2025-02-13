import { Todo } from '../types/Todo.ts'
import { db } from '../utils/firebaseConfig.ts'
import {
	collection,
	addDoc,
	getDocs,
	doc,
	updateDoc,
	deleteDoc,
	getDoc,
} from 'firebase/firestore'

export const getTasks = async (
	userId: string,
	listId: string
): Promise<Todo[]> => {
	const listOwnerRef = doc(db, 'users', userId, 'todoLists', listId)
	const listOwnerSnapshot = await getDoc(listOwnerRef)

	if (listOwnerSnapshot.exists()) {
		const tasksSnapshot = await getDocs(
			collection(db, 'users', userId, 'todoLists', listId, 'tasks')
		)

		return tasksSnapshot.docs.map(doc => ({
			id: doc.id,
			...doc.data(),
		})) as Todo[]
	}

	const collaboratorsRef = collection(
		db,
		'users',
		userId,
		'todoLists',
		listId,
		'collaborators'
	)
	const collaboratorsSnapshot = await getDocs(collaboratorsRef)

	const collaboratorDoc = collaboratorsSnapshot.docs.find(
		doc => doc.id === userId
	)

	if (collaboratorDoc) {
		const tasksSnapshot = await getDocs(
			collection(db, 'users', userId, 'todoLists', listId, 'tasks')
		)

		return tasksSnapshot.docs.map(doc => ({
			id: doc.id,
			...doc.data(),
		})) as Todo[]
	} else {
		alert('Ви не маєте доступу до задач цього списку')
		return []
	}
}

export const createTask = async (
	userId: string,
	listId: string,
	title: string,
	description: string
): Promise<Todo> => {
	const docRef = await addDoc(
		collection(db, 'users', userId, 'todoLists', listId, 'tasks'),
		{
			title,
			description,
			completed: false,
		}
	)
	return { id: docRef.id, title, description, completed: false }
}

export const updateTask = async (
	userId: string,
	listId: string,
	taskId: string,
	updates: Partial<Todo>
): Promise<void> => {
	await updateDoc(
		doc(db, 'users', userId, 'todoLists', listId, 'tasks', taskId),
		updates
	)
}

export const deleteTask = async (
	userId: string,
	listId: string,
	taskId: string
): Promise<void> => {
	await deleteDoc(
		doc(db, 'users', userId, 'todoLists', listId, 'tasks', taskId)
	)
}

export const toggleTaskCompletion = async (
	userId: string,
	listId: string,
	taskId: string,
	completed: boolean
): Promise<void> => {
	await updateDoc(
		doc(db, 'users', userId, 'todoLists', listId, 'tasks', taskId),
		{
			completed: !completed,
		}
	)
}
