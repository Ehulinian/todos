import { collection, doc, getDocs, setDoc } from 'firebase/firestore'
import { db } from '../utils/firebaseConfig'

export const addCollaborator = async (
	listId: string,
	userEmail: string,
	role: 'admin' | 'viewer'
) => {
	const collaboratorsRef = collection(db, 'todoLists', listId, 'collaborators')
	const userDocRef = doc(collaboratorsRef, userEmail)

	await setDoc(userDocRef, { email: userEmail, role })
}

import { getDoc } from 'firebase/firestore'

export const getUserRole = async (listId: string, userEmail: string) => {
	const userDocRef = doc(db, 'todoLists', listId, 'collaborators', userEmail)
	const userDoc = await getDoc(userDocRef)

	if (userDoc.exists()) {
		return userDoc.data().role
	} else {
		return null
	}
}

export const getCollaborators = async (listId: string) => {
	const collaboratorsRef = collection(db, 'todoLists', listId, 'collaborators')
	const snapshot = await getDocs(collaboratorsRef)
	const collaborators: { email: string; role: 'admin' | 'viewer' }[] = []

	snapshot.forEach(doc => {
		const data = doc.data()
		collaborators.push({ email: data.email, role: data.role })
	})

	return collaborators
}
