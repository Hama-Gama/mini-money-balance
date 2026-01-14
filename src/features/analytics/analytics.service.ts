// utils/analytics.ts
export const getAnalytics = () => {
	if (typeof window === 'undefined') {
		// SSR: localStorage недоступен
		return { expensesTotal: 0, incomesTotal: 0 }
	}

	try {
		const expenses = JSON.parse(localStorage.getItem('expenses') || '[]')
		const incomes = JSON.parse(localStorage.getItem('incomes') || '[]')

		return {
			expensesTotal: expenses.reduce(
				(s: number, e: any) => s + (Number(e.amount) || 0),
				0
			),
			incomesTotal: incomes.reduce(
				(s: number, i: any) => s + (Number(i.amount) || 0),
				0
			),
		}
	} catch {
		return { expensesTotal: 0, incomesTotal: 0 }
	}
}
