export const getAnalytics = () => {
	const expenses = JSON.parse(localStorage.getItem('expenses') || '[]')
	const incomes = JSON.parse(localStorage.getItem('incomes') || '[]')

	return {
		expensesTotal: expenses.reduce((s: number, e: any) => s + e.amount, 0),
		incomesTotal: incomes.reduce((s: number, i: any) => s + i.amount, 0),
	}
}
