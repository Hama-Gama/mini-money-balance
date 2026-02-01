import { useEffect, useState } from 'react'
import { nanoid } from 'nanoid'
import type { ExpenseCategory } from './types'

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

	// добавить расход по id
	const addExpense = (id: string, value: number) => {
		setExpenses(prev =>
			prev.map(e => (e.id === id ? { ...e, amount: e.amount + value } : e)),
		)
	}

	// добавить / создать категорию по названию
	const addExpenseByTitle = (title: string, amount: number) => {
		setExpenses(prev => {
			const existing = prev.find(c => c.title === title)

			if (existing) {
				return prev.map(c =>
					c.id === existing.id ? { ...c, amount: c.amount + amount } : c,
				)
			}

			return [
				...prev,
				{
					id: nanoid(),
					title,
					amount,
				},
			]
		})
	}

	// удалить категорию
	const removeCategory = (id: string) => {
		setExpenses(prev => prev.filter(e => e.id !== id))
	}

	// общий итог
	const getTotal = () =>
		expenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0)

	// 🔴 СБРОС ВСЕХ СУММ
	const resetAll = () => {
		setExpenses(prev =>
			prev.map(e => ({
				...e,
				amount: 0,
			})),
		)
	}

	return {
		expenses,
		addExpense,
		addExpenseByTitle,
		removeCategory,
		getTotal,
		resetAll,
	}
}
