import { useEffect, useState } from 'react'
import { nanoid } from 'nanoid'
import type { Credit } from './types'

const STORAGE_KEY = 'credits'

export const useCreditsStore = () => {
	const [credits, setCredits] = useState<Credit[]>(() => {
		try {
			return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
		} catch {
			return []
		}
	})

	useEffect(() => {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(credits))
	}, [credits])

	const addCredit = (data: Omit<Credit, 'id' | 'paidAmount' | 'isClosed'>) => {
		setCredits(prev => [
			...prev,
			{
				...data,
				id: nanoid(),
				paidAmount: 0,
				isClosed: false,
			},
		])
	}

	const getMonthlyPaymentTotal = () =>
		credits.filter(c => !c.isClosed).reduce((s, c) => s + c.monthlyPayment, 0)

	const getTotalDebt = () =>
		credits
			.filter(c => !c.isClosed)
			.reduce((s, c) => s + (c.totalAmount - c.paidAmount), 0)

	return {
		credits,
		addCredit,
		getMonthlyPaymentTotal,
		getTotalDebt,
	}
}
