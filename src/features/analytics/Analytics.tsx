import { useEffect, useState } from 'react'

type AnalyticsData = {
	expenses: number
	incomes: number
	credits: number
	savings: number
	balance: number
}

const getSum = (key: string): number => {
	try {
		const data = JSON.parse(localStorage.getItem(key) || '[]')
		return data.reduce(
			(sum: number, item: { amount: number }) => sum + item.amount,
			0
		)
	} catch {
		return 0
	}
}

export const Analytics = () => {
	const [data, setData] = useState<AnalyticsData | null>(null)

	useEffect(() => {
		const expenses = getSum('expenses')
		const incomes = getSum('incomes')
		const credits = getSum('credits')
		const savings = getSum('savings')

		setData({
			expenses,
			incomes,
			credits,
			savings,
			balance: incomes - expenses - credits,
		})
	}, [])

	if (!data) return null

	return (
		<div className='space-y-4'>
			<h2 className='text-xl font-bold'>Аналитика</h2>

			<div className='grid grid-cols-2 gap-3'>
				<Card title='Доходы' value={data.incomes} />
				<Card title='Расходы' value={data.expenses} />
				<Card title='Кредиты' value={data.credits} />
				<Card title='Сбережения' value={data.savings} />
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
