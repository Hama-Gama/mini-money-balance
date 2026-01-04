export type Credit = {
	id: string
	bankName: string
	bankLogo?: string

	totalAmount: number
	overpayment: number
	monthlyPayment: number
	months: number

	startDate: number
	endDate: number
	nextPaymentDate: number

	paidAmount: number
	isClosed: boolean
}


type CreditsContextType = {
	credits: Credit[]
	addCredit: (data: Omit<Credit, 'id' | 'paidAmount' | 'isClosed'>) => void
	getMonthlyPaymentTotal: () => number
	getTotalDebt: () => number
	payCredit: (id: string, amount: number) => void // добавить
	removeCredit: (id: string) => void // добавить
}