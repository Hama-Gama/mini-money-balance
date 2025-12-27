// Идентификатор вкладки приложения
export type Tab = 1 | 2 | 3 | 4 | 5

// (опционально, если захочешь перейти на enum-подобный стиль)
export const TABS = {
	EXPENSES: 1,
	INCOMES: 2,
	CREDITS: 3,
	SAVINGS: 4,
	ANALYTICS: 5,
} as const

