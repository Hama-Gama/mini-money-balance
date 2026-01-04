import { create } from 'zustand'
import { nanoid } from 'nanoid'

export type Credit = {
	id: string
	bankName: string
	totalAmount: number
	monthlyPayment: number
	paidAmount: number
	overpayment: number
}

type CreditsStore = {
	credits: Credit[]
	addCredit: (data: {
		bankName: string
		totalAmount: number
		monthlyPayment: number
		overpayment?: number
	}) => void
	payCredit: (id: string, amount: number) => void
	removeCredit: (id: string) => void
	getTotalDebt: () => number
	getMonthlyPaymentTotal: () => number
}

export const useCreditsStore = create<CreditsStore>((set, get) => ({
	credits: [],
	addCredit: ({ bankName, totalAmount, monthlyPayment, overpayment = 0 }) =>
		set(state => ({
			credits: [
				...state.credits,
				{
					id: nanoid(),
					bankName,
					totalAmount,
					monthlyPayment,
					paidAmount: 0,
					overpayment,
				},
			],
		})),
	payCredit: (id, amount) =>
		set(state => ({
			credits: state.credits.map(c =>
				c.id === id
					? {
							...c,
							paidAmount: c.paidAmount + amount,
							overpayment:
								c.paidAmount + amount > c.totalAmount
									? c.paidAmount + amount - c.totalAmount
									: 0,
					  }
					: c
			),
		})),
	removeCredit: id =>
		set(state => ({
			credits: state.credits.filter(c => c.id !== id),
		})),
	getTotalDebt: () =>
		get().credits.reduce((sum, c) => sum + (c.totalAmount - c.paidAmount), 0),
	getMonthlyPaymentTotal: () =>
		get().credits.reduce((sum, c) => sum + c.monthlyPayment, 0),
}))

