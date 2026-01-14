import { create } from 'zustand'
import { nanoid } from 'nanoid'
import type { Credit } from './types'
import { getMonthKey } from '@/shared/utils/month'

const STORAGE_KEY = 'credits'

const loadCredits = (): Credit[] => {
	try {
		const data = localStorage.getItem(STORAGE_KEY)
		return data ? JSON.parse(data) : []
	} catch {
		return []
	}
}

type CreditsStore = {
	credits: Credit[]
	addCredit: (title: string, amount: number) => void
	removeCredit: (id: string) => void
	getTotal: () => number
}

export const useCreditsStore = create<CreditsStore>((set, get) => ({
	credits: loadCredits(),

	addCredit: (title, amount) =>
		set(state => {
			const currentMonth = getMonthKey()

			// 🔁 если месяц сменился — обнуляем суммы, но оставляем названия
			const normalized = state.credits.map(c =>
				c.month !== currentMonth ? { ...c, amount: 0, month: currentMonth } : c
			)

			const updated = [
				...normalized,
				{
					id: nanoid(),
					title,
					amount,
					month: currentMonth,
				},
			]

			localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))

			return { credits: updated }
		}),

	removeCredit: id =>
		set(state => {
			const updated = state.credits.filter(c => c.id !== id)
			localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
			return { credits: updated }
		}),

	getTotal: () => get().credits.reduce((sum, c) => sum + c.amount, 0),
}))
