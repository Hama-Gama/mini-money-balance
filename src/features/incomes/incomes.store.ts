import { useEffect, useState } from 'react'
import { nanoid } from 'nanoid'
import { getMonthKey } from '@/shared/utils/month'
import type { Income } from './types'

const STORAGE_KEY = 'incomes'


const loadIncomes = (): Income[] => {
	try {
		return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
	} catch {
		return []
	}
}



export const useIncomesStore = () => {
	const [incomes, setIncomes] = useState<Income[]>(loadIncomes)

	useEffect(() => {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(incomes))
	}, [incomes])

	const addIncome = (title: string, amount: number) => {
		setIncomes(prev => [
			...prev,
			{
				id: nanoid(),
				title,
				amount,
				month: getMonthKey(),
				createdAt: Date.now(),
			},
		])
	}

	const getMonthlyTotal = (month: string) =>
		incomes.filter(i => i.month === month).reduce((s, i) => s + i.amount, 0)

	return {
		incomes,
		addIncome,
		getMonthlyTotal,
	}
}