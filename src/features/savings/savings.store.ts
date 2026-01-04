import { useEffect, useState } from 'react'
import { nanoid } from 'nanoid'
import { getMonthKey } from '@/shared/utils/month'

export type Saving = {
	id: string
	title: string
	target: number
	current: number
	month: string
	createdAt: number
}

const STORAGE_KEY = 'savings'

const loadSavings = (): Saving[] => {
	try {
		return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
	} catch {
		return []
	}
}

export const useSavingsStore = () => {
	const [savings, setSavings] = useState<Saving[]>(loadSavings)

	useEffect(() => {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(savings))
	}, [savings])

	const addSaving = (title: string, target: number) => {
		setSavings(prev => [
			...prev,
			{
				id: nanoid(),
				title,
				target,
				current: 0,
				month: getMonthKey(),
				createdAt: Date.now(),
			},
		])
	}

	const addToSaving = (id: string, amount: number) => {
		setSavings(prev =>
			prev.map(s => (s.id === id ? { ...s, current: s.current + amount } : s))
		)
	}

	const removeSaving = (id: string) => {
		setSavings(prev => prev.filter(s => s.id !== id))
	}

	const getMonthlyTotal = (month: string) =>
		savings
			.filter(s => s.month === month)
			.reduce((sum, s) => sum + s.current, 0)

	return {
		savings,
		addSaving,
		addToSaving,
		removeSaving,
		getMonthlyTotal,
	}
}
