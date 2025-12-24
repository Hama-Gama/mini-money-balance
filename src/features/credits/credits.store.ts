import { useEffect, useState } from 'react'
import { nanoid } from 'nanoid'

export type Credit = {
	id: string
	title: string
	amount: number // общая сумма кредита
	paid: number // выплачено
}

const STORAGE_KEY = 'credits'

const loadCredits = (): Credit[] => {
	try {
		const data = localStorage.getItem(STORAGE_KEY)
		return data ? JSON.parse(data) : []
	} catch {
		return []
	}
}

export const useCreditsStore = () => {
	const [credits, setCredits] = useState<Credit[]>(loadCredits)

	// sync с localStorage
	useEffect(() => {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(credits))
	}, [credits])

	const addCredit = (title: string, amount: number) => {
		setCredits(prev => [
			...prev,
			{
				id: nanoid(),
				title,
				amount,
				paid: 0,
			},
		])
	}

	const payCredit = (id: string, value: number) => {
		setCredits(prev =>
			prev.map(c =>
				c.id === id ? { ...c, paid: Math.min(c.paid + value, c.amount) } : c
			)
		)
	}

	const removeCredit = (id: string) => {
		setCredits(prev => prev.filter(c => c.id !== id))
	}

	const getTotalDebt = () =>
		credits.reduce((sum, c) => sum + (c.amount - c.paid), 0)

	return {
		credits,
		addCredit,
		payCredit,
		removeCredit,
		getTotalDebt,
	}
}
