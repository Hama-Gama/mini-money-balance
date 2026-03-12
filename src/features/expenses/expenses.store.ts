import { useEffect, useRef, useState } from 'react'
import { nanoid } from 'nanoid'
import type { ExpenseCategory } from './types'
import { pullExpensesFromCloud, pushExpensesToCloud } from './expenses.sync'

const STORAGE_KEY = 'expenses'

const isExpenseArray = (value: unknown): value is ExpenseCategory[] => {
	return (
		Array.isArray(value) &&
		value.every(
			item =>
				typeof item === 'object' &&
				item !== null &&
				'id' in item &&
				'title' in item &&
				'amount' in item,
		)
	)
}

const normalizeExpenses = (value: unknown): ExpenseCategory[] => {
	if (isExpenseArray(value)) return value

	if (
		typeof value === 'object' &&
		value !== null &&
		'state' in value &&
		typeof value.state === 'object' &&
		value.state !== null &&
		'expenses' in value.state
	) {
		const nested = (value.state as { expenses?: unknown }).expenses
		if (isExpenseArray(nested)) return nested
	}

	return []
}

const loadExpenses = (): ExpenseCategory[] => {
	try {
		const raw = localStorage.getItem(STORAGE_KEY)
		if (!raw) return []

		const parsed = JSON.parse(raw)
		return normalizeExpenses(parsed)
	} catch {
		return []
	}
}

export const useExpensesStore = () => {
	const [expenses, setExpenses] = useState<ExpenseCategory[]>(() =>
		loadExpenses(),
	)

	useEffect(() => {
		if (!navigator.onLine) return
		;(async () => {
			try {
				await pullExpensesFromCloud()
				setExpenses(loadExpenses())
			} catch {
				// оставляем локальные данные как есть
			}
		})()
	}, [])

	useEffect(() => {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses))
	}, [expenses])

	const t = useRef<number | null>(null)

	useEffect(() => {
		if (!navigator.onLine) return

		if (t.current) window.clearTimeout(t.current)

		t.current = window.setTimeout(() => {
			void pushExpensesToCloud()
		}, 500)

		return () => {
			if (t.current) window.clearTimeout(t.current)
		}
	}, [expenses])

	const addExpenseByTitle = (title: string, amount: number) => {
		const normalizedTitle = title.trim()
		if (!normalizedTitle || !amount) return

		setExpenses(prev => {
			const safePrev = Array.isArray(prev) ? prev : []
			const existing = safePrev.find(c => c.title === normalizedTitle)

			if (existing) {
				return safePrev.map(c =>
					c.id === existing.id
						? { ...c, amount: (Number(c.amount) || 0) + amount }
						: c,
				)
			}

			return [
				...safePrev,
				{
					id: nanoid(),
					title: normalizedTitle,
					amount,
				},
			]
		})
	}

	const removeCategory = (id: string) => {
		setExpenses(prev => {
			const safePrev = Array.isArray(prev) ? prev : []
			return safePrev.filter(e => e.id !== id)
		})
	}

	const renameCategory = (id: string, newTitle: string) => {
		const normalizedTitle = newTitle.trim()
		if (!normalizedTitle) return

		setExpenses(prev => {
			const safePrev = Array.isArray(prev) ? prev : []
			return safePrev.map(item =>
				item.id === id ? { ...item, title: normalizedTitle } : item,
			)
		})
	}

	const reorderExpenses = (newExpenses: ExpenseCategory[]) => {
		setExpenses(newExpenses)
	}

	const getTotal = () => {
		const safeExpenses = Array.isArray(expenses) ? expenses : []
		return safeExpenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0)
	}

	const resetAll = () => {
		setExpenses(prev => {
			const safePrev = Array.isArray(prev) ? prev : []
			return safePrev.map(e => ({ ...e, amount: 0 }))
		})
	}

	return {
		expenses,
		addExpenseByTitle,
		removeCategory,
		renameCategory,
		reorderExpenses,
		getTotal,
		resetAll,
	}
}
