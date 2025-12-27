import './App.css'

import { useState } from 'react'
import type { Tab } from '@/types/tab'

import { Header } from '@/components/Header'
import { ExpenseList } from '@/features/expenses/ExpenseList'
import { IncomeList } from '@/features/incomes/IncomeList'
import { CreditList } from '@/features/credits/CreditList'
import { SavingsList } from '@/features/savings/SavingsList'
import { Analytics } from '@/features/analytics/Analytics'
import { BottomNavigationBar } from '@/components/BottomNavigationBar'


export default function App() {
	const [activeTab, setActiveTab] = useState<Tab>(1)

	return (
		<div className='max-w-md mx-auto p-3 space-y-4 pb-16'>
			<Header />

			{activeTab === 1 && <ExpenseList />}
			{activeTab === 2 && <IncomeList />}
			{activeTab === 3 && <CreditList />}
			{activeTab === 4 && <SavingsList />}
			{activeTab === 5 && <Analytics />}

			<BottomNavigationBar activeTab={activeTab} onChange={setActiveTab} />
		</div>
	)
}
