import { useEffect, useState } from 'react'
import { nanoid } from 'nanoid'
import type { ExpenseCategory } from '@/types'

const STORAGE_KEY = 'expenses'

const loadExpenses = (): ExpenseCategory[] => {
	try {
		const data = localStorage.getItem(STORAGE_KEY)
		return data ? JSON.parse(data) : []
	} catch {
		return []
	}
}

export const useExpensesStore = () => {
	const [expenses, setExpenses] = useState<ExpenseCategory[]>(loadExpenses)

	// sync с localStorage
	useEffect(() => {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses))
	}, [expenses])

	const addCategory = (title: string) => {
		setExpenses(prev => [
			...prev,
			{
				id: nanoid(),
				title,
				amount: 0,
			},
		])
	}

	const addExpense = (id: string, value: number) => {
		setExpenses(prev =>
			prev.map(e => (e.id === id ? { ...e, amount: e.amount + value } : e))
		)
	}

	const removeCategory = (id: string) => {
		setExpenses(prev => prev.filter(e => e.id !== id))
	}

	const getTotal = () => expenses.reduce((sum, e) => sum + e.amount, 0)

	return {
		expenses,
		addCategory,
		addExpense,
		removeCategory,
		getTotal,
	}
}
