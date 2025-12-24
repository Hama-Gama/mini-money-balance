import { useEffect, useState } from 'react'
import { nanoid } from 'nanoid'
import type { Saving } from './types'

const STORAGE_KEY = 'savings'

const loadSavings = (): Saving[] => {
	try {
		const data = localStorage.getItem(STORAGE_KEY)
		return data ? JSON.parse(data) : []
	} catch {
		return []
	}
}

export const useSavingsStore = () => {
	const [savings, setSavings] = useState<Saving[]>(loadSavings)

	// sync with localStorage
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
			},
		])
	}

	const addToSaving = (id: string, amount: number) => {
		if (amount <= 0) return

		setSavings(prev =>
			prev.map(s => (s.id === id ? { ...s, current: s.current + amount } : s))
		)
	}

	const removeSaving = (id: string) => {
		setSavings(prev => prev.filter(s => s.id !== id))
	}

	const getTotalSavings = () => savings.reduce((sum, s) => sum + s.current, 0)

	return {
		savings,
		addSaving,
		addToSaving,
		removeSaving,
		getTotalSavings,
	}
}
