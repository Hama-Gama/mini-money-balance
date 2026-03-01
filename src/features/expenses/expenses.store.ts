import { useEffect, useRef, useState } from 'react'
import { nanoid } from 'nanoid'
import type { ExpenseCategory } from './types'
import { pullExpensesFromCloud, pushExpensesToCloud } from './expenses.sync'

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

	// ✅ 1) при старте: если онлайн — подтянуть с облака
	useEffect(() => {
		if (!navigator.onLine) return
		;(async () => {
			await pullExpensesFromCloud()
			setExpenses(loadExpenses()) // обновляем state из localStorage
		})()
	}, [])

	// ✅ 2) localStorage sync
	useEffect(() => {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses))
	}, [expenses])

	// ✅ 3) push в облако (debounce)
	const t = useRef<number | null>(null)
	useEffect(() => {
		if (!navigator.onLine) return

		if (t.current) window.clearTimeout(t.current)
		t.current = window.setTimeout(() => {
			pushExpensesToCloud()
		}, 500)

		return () => {
			if (t.current) window.clearTimeout(t.current)
		}
	}, [expenses])

	// --- твоя логика ниже без изменений ---
	const addExpenseByTitle = (title: string, amount: number) => {
		setExpenses(prev => {
			const existing = prev.find(c => c.title === title)
			if (existing) {
				return prev.map(c =>
					c.id === existing.id ? { ...c, amount: c.amount + amount } : c,
				)
			}
			return [...prev, { id: nanoid(), title, amount }]
		})
	}

	const removeCategory = (id: string) => {
		setExpenses(prev => prev.filter(e => e.id !== id))
	}

	const getTotal = () =>
		expenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0)

	const resetAll = () => {
		setExpenses(prev => prev.map(e => ({ ...e, amount: 0 })))
	}

	return {
		expenses,
		addExpenseByTitle,
		removeCategory,
		getTotal,
		resetAll,
	}
}
