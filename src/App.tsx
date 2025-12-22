import './App.css'


import { ExpenseList } from './components/ExpenseList'

// import { Header } from '@/components/Header'
// import { ExpenseList } from '@/components/ExpenseList'
import { Header } from './components/Header'

function App() {
	return (
		<div className='mx-auto max-w-md p-4 space-y-4'>
			<Header />

			{/* В будущем здесь будут вкладки: -, +, кредиты, сбережения, аналитика */}
			<ExpenseList />
		</div>
	)
}

export default App
