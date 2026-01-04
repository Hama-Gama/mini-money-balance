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

	paidAmount: number
	isClosed: boolean
	nextPaymentDate: number
}

