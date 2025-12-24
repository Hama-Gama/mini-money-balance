// Тип источника дохода (можно расширять)
export type IncomeSource =
	| 'salary'
	| 'freelance'
	| 'business'
	| 'investment'
	| 'other'

// Основная сущность дохода
export type Income = {
	id: string
	title: string
	amount: number

	// Опционально — для будущего расширения
	source?: IncomeSource
	date?: string // ISO string
}
