import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import { Register } from './pages/Register.tsx'
import { ProtectedRoute } from './components/ProtectedRoute.tsx'
import { Home } from './pages/Home.tsx'
import { Login } from './pages/Login.tsx'
import { AuthProvider } from './store/AuthProvider.tsx'
import { Tasks } from './components/Tasks.tsx'

export const Root = () => (
	<Router>
		<AuthProvider>
			<Routes>
				<Route
					path='/'
					element={
						<ProtectedRoute>
							<Home />
						</ProtectedRoute>
					}
				/>
				<Route
					path='/list/:listId'
					element={
						<ProtectedRoute>
							<Tasks />
						</ProtectedRoute>
					}
				/>
				<Route path='/login' element={<Login />} />
				<Route path='/register' element={<Register />} />
			</Routes>
		</AuthProvider>
	</Router>
)
