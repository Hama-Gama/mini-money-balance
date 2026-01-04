import { useEffect, useState } from 'react'
import { nanoid } from 'nanoid'
import { getMonthKey } from '@/shared/utils/month'
import type { Saving } from './types'

const STORAGE_KEY = 'savings'

export const useSavingsStore = () => {
	const [savings, setSavings] = useState<Saving[]>(() => {
		try {
			return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
		} catch {
			return []
		}
	})

	useEffect(() => {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(savings))
	}, [savings])

	const addSaving = (amount: number) => {
		setSavings(prev => [
			...prev,
			{
				id: nanoid(),
				amount,
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
		savings.filter(s => s.month === month).reduce((sum, s) => sum + s.amount, 0)

	return {
		savings,
		addToSaving,
		removeSaving,
		addSaving,
		getMonthlyTotal,
	}
}
