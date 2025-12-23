// Статус кредита
export type CreditStatus = 'active' | 'closed'

// Платёж по кредиту (на будущее)
export type CreditPayment = {
	id: string
	amount: number
	date: string // ISO string
}

// Основная сущность кредита
export type Credit = {
	id: string
	title: string

	// Финансы
	amount: number // общая сумма кредита
	paid: number // выплачено
	interestRate?: number // годовая ставка (%)

	// Даты
	startDate?: string // ISO
	endDate?: string // ISO

	// Состояние
	status: CreditStatus

	// История платежей (на будущее)
	payments?: CreditPayment[]
}
