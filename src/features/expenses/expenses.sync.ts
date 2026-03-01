import { supabase } from '@/lib/supabase'
import type { ExpenseCategory } from '@/features/expenses/types'

const STORAGE_KEY = 'expenses'

export const pushExpensesToCloud = async () => {
	const { data: sessionData } = await supabase.auth.getSession()
	const user = sessionData.session?.user
	if (!user) return

	const raw = localStorage.getItem(STORAGE_KEY)
	const expenses: ExpenseCategory[] = raw ? JSON.parse(raw) : []

	await supabase
		.from('expenses_state')
		.upsert({
			user_id: user.id,
			data: expenses,
			updated_at: new Date().toISOString(),
		})
}

export const pullExpensesFromCloud = async () => {
	const { data: sessionData } = await supabase.auth.getSession()
	const user = sessionData.session?.user
	if (!user) return

	const { data, error } = await supabase
		.from('expenses_state')
		.select('data')
		.eq('user_id', user.id)
		.single()

	if (error) return
	if (!data?.data) return

	localStorage.setItem(STORAGE_KEY, JSON.stringify(data.data))
}
