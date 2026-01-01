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
