import { useEffect, useState } from 'react'
import { nanoid } from 'nanoid'

export type Income = {
	id: string
	title: string
	amount: number
}

const STORAGE_KEY = 'incomes'

const loadIncomes = (): Income[] => {
	try {
		const data = localStorage.getItem(STORAGE_KEY)
		return data ? JSON.parse(data) : []
	} catch {
		return []
	}
}

export const useIncomesStore = () => {
	const [incomes, setIncomes] = useState<Income[]>(loadIncomes)

	// sync с localStorage
	useEffect(() => {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(incomes))
	}, [incomes])

	const addIncome = (title: string, amount: number) => {
		const newIncome = {
			id: nanoid(),
			title,
			amount,
		}
		setIncomes(prev => [...prev, newIncome])
		return newIncome
	}

	const removeIncome = (id: string) => {
		setIncomes(prev => prev.filter(i => i.id !== id))
	}

	const getTotal = () => incomes.reduce((sum, i) => sum + i.amount, 0)

	return {
		incomes,
		addIncome,
		removeIncome,
		getTotal,
	}
}
