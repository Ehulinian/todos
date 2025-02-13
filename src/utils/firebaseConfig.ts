import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
	apiKey: 'AIzaSyDJ0y81bD7ekoHTb-uX-tFxypxJ9rQhxKQ',
	authDomain: 'todos-40b27.firebaseapp.com',
	projectId: 'todos-40b27',
	storageBucket: 'todos-40b27.firebasestorage.app',
	messagingSenderId: '900400730521',
	appId: '1:900400730521:web:be18543d1456b64f204308',
	measurementId: 'G-2DBFR2SWHW',
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
