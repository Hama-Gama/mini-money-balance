
import { nanoid } from 'nanoid'
import { useEffect, useState } from 'react'
import type { Saving } from './types'

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

	const addSaving = (title: string, target: number, current: number) => {
		setSavings(prev => [
			...prev,
			{
				id: nanoid(),
				title,
				target,
				current,
			},
		])
	}

	const addAmount = (id: string, amount: number) => {
		setSavings(prev =>
			prev.map(s => (s.id === id ? { ...s, current: s.current + amount } : s)),
		)
	}

	const updateSaving = (id: string, title: string, target: number) => {
		setSavings(prev =>
			prev.map(s => (s.id === id ? { ...s, title, target } : s)),
		)
	}

	const removeSaving = (id: string) => {
		setSavings(prev => prev.filter(s => s.id !== id))
	}

	const getTotal = () => savings.reduce((sum, s) => sum + s.current, 0)

	return {
		savings,
		addSaving,
		addAmount,
		updateSaving,
		removeSaving,
		getTotal,
	}
}
