import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { nanoid } from 'nanoid'
import type { Credit } from './types'
import { getMonthKey } from '@/shared/utils/month'

type CreditsStore = {
	credits: Credit[]
	addCredit: (title: string, amount: number) => void
	removeCredit: (id: string) => void
	getTotal: () => number
	getMonthlyTotal: () => number
}

export const useCreditsStore = create<CreditsStore>()(
	persist(
		(set, get) => ({
			credits: [],

			addCredit: (title, amount) =>
				set(state => {
					const currentMonth = getMonthKey()

					// 🔁 если месяц сменился — обнуляем суммы, но сохраняем кредиты
					const normalized = state.credits.map(c =>
						c.month !== currentMonth
							? { ...c, amount: 0, month: currentMonth }
							: c
					)

					return {
						credits: [
							...normalized,
							{
								id: nanoid(),
								title,
								amount,
								month: currentMonth,
							},
						],
					}
				}),

			removeCredit: id =>
				set(state => ({
					credits: state.credits.filter(c => c.id !== id),
				})),

			getTotal: () => get().credits.reduce((sum, c) => sum + c.amount, 0),

			getMonthlyTotal: () => {
				const month = getMonthKey()
				return get()
					.credits.filter(c => c.month === month)
					.reduce((sum, c) => sum + c.amount, 0)
			},
		}),
		{
			name: 'credits', // ключ localStorage
		}
	)
)
