import { useMemo } from 'react'
import { useCreditsStore } from './credits.store'

type MonthCell = {
	year: number
	month: number
	amount: number
	isPaid: boolean
}

const monthNames = [
	'Январь',
	'Февраль',
	'Март',
	'Апрель',
	'Май',
	'Июнь',
	'Июль',
	'Август',
	'Сентябрь',
	'Октябрь',
	'Ноябрь',
	'Декабрь',
]

export const CreditCalendar = () => {
	const { credits } = useCreditsStore()

	const calendar = useMemo(() => {
		const map = new Map<string, MonthCell>()

		credits.forEach(credit => {
			for (let i = 0; i < credit.months; i++) {
				const date = new Date(credit.startDate)
				date.setMonth(date.getMonth() + i)

				const year = date.getFullYear()
				const month = date.getMonth()
				const key = `${year}-${month}`

				const alreadyPaidMonths = Math.floor(
					credit.paidAmount / credit.monthlyPayment
				)

				const isPaid = i < alreadyPaidMonths

				if (!map.has(key)) {
					map.set(key, {
						year,
						month,
						amount: credit.monthlyPayment,
						isPaid,
					})
				} else {
					const existing = map.get(key)!
					existing.amount += credit.monthlyPayment
					existing.isPaid = existing.isPaid && isPaid
				}
			}
		})

		return Array.from(map.values()).sort((a, b) =>
			a.year !== b.year ? a.year - b.year : a.month - b.month
		)
	}, [credits])

	const groupedByYear = calendar.reduce<Record<number, MonthCell[]>>(
		(acc, item) => {
			acc[item.year] = acc[item.year] || []
			acc[item.year].push(item)
			return acc
		},
		{}
	)

	return (
		<div className='space-y-6'>
			<h2 className='text-xl font-bold'>Календарь платежей</h2>

			{Object.entries(groupedByYear).map(([year, months]) => (
				<div key={year} className='space-y-3'>
					<h3 className='text-lg font-semibold'>{year}</h3>

					<div className='grid grid-cols-3 gap-3'>
						{months.map(m => (
							<div
								key={`${m.year}-${m.month}`}
								className='border rounded-xl p-3 text-center space-y-2'
							>
								<div className='font-medium'>{monthNames[m.month]}</div>

								<div
									className={`mx-auto w-8 h-8 flex items-center justify-center rounded-full border ${
										m.isPaid
											? 'bg-green-500 text-white border-green-500'
											: 'border-muted-foreground text-muted-foreground'
									}`}
								>
									{m.isPaid ? '✓' : '•'}
								</div>

								<div className='font-semibold'>
									{m.amount.toLocaleString('ru-RU')} ₸
								</div>

								<div className='text-xs text-blue-600'>Подробнее</div>
							</div>
						))}
					</div>
				</div>
			))}
		</div>
	)
}
