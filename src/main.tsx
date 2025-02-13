import { createRoot } from 'react-dom/client'
import { Root } from './Root'
import './tailwind.css'

const container = document.getElementById('root') as HTMLElement

createRoot(container).render(<Root />)
