// export type Saving = {
// 	id: string
// 	title: string
// 	target: number
// 	current: number
// 	// Сумма отложенных средств
// 	amount: number
// 	month: string
// 	createdAt: number
// }




	type Saving = {
		id: string
		title: string
		target: number
		current: number
	}

	type SavingsStore = {
		savings: Saving[]
		addSaving: (title: string, target: number) => void
		addToSaving: (id: string, amount: number) => void
		removeSaving: (id: string) => void
		getMonthlyTotal: () => number
	}