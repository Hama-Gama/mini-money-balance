import { useEffect, useState } from 'react'
import { useCreditsStore } from '@/features/credits/credits.store'
import { getAnalytics } from '@/features/analytics/analytics.service'

type AnalyticsData = {
	incomes: number
	expenses: number
	credits: number
	balance: number
}

export const Analytics = () => {
	const { getMonthlyTotal } = useCreditsStore()
	const [data, setData] = useState<AnalyticsData | null>(null)

	useEffect(() => {
		const { incomesTotal, expensesTotal } = getAnalytics()
		const credits = getMonthlyTotal()

		setData({
			incomes: incomesTotal,
			expenses: expensesTotal,
			credits,
			balance: incomesTotal - expensesTotal - credits,
		})
	}, [getMonthlyTotal])

	if (!data) return null

	return (
		<div className='space-y-4'>
			<h2 className='text-xl font-bold'>Аналитика</h2>

			<div className='grid grid-cols-2 gap-3'>
				<Card title='Доходы' value={data.incomes} />
				<Card title='Расходы' value={data.expenses} />
				<Card title='Кредиты' value={data.credits} />
			</div>

			<div className='border-t pt-4 flex justify-between text-lg font-semibold'>
				<span>Баланс</span>
				<span className={data.balance >= 0 ? 'text-green-600' : 'text-red-600'}>
					{data.balance.toLocaleString('ru-RU')}
				</span>
			</div>
		</div>
	)
}

const Card = ({ title, value }: { title: string; value: number }) => (
	<div className='rounded-xl border p-3'>
		<div className='text-sm text-muted-foreground'>{title}</div>
		<div className='text-lg font-bold'>{value.toLocaleString('ru-RU')}</div>
	</div>
)
