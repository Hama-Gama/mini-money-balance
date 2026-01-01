import { useState } from 'react'
import { getMonthKey } from '@/shared/utils/month'
import { useIncomesStore } from '@/features/incomes/incomes.store'
import { useSavingsStore } from '@/features/savings/savings.store'
import { useCreditsStore } from '@/features/credits/credits.store'

export const Analytics = () => {
	const [month, setMonth] = useState(getMonthKey())

	const { getMonthlyTotal: incomes } = useIncomesStore()
	const { getMonthlyTotal: savings } = useSavingsStore()
	const { getMonthlyPaymentTotal } = useCreditsStore()

	const income = incomes(month)
	const credit = getMonthlyPaymentTotal()
	const saving = savings(month)

	const creditPercent = income > 0 ? Math.round((credit / income) * 100) : 0

	return (
		<div className='space-y-4'>
			<h2 className='text-xl font-bold'>Аналитика</h2>

			<input
				type='month'
				value={month}
				onChange={e => setMonth(e.target.value)}
				className='border rounded p-1'
			/>

			<div className='grid grid-cols-2 gap-3'>
				<Card title='Доходы' value={income} />
				<Card title='Кредиты / мес' value={credit} />
				<Card title='Сбережения' value={saving} />
				<Card title='Остаток' value={income - credit - saving} />
			</div>

			{creditPercent > 15 && (
				<div className='p-3 rounded-xl bg-red-100 text-red-700 text-sm'>
					⚠ Кредиты составляют {creditPercent}% дохода.
					<br />
					Не рекомендуется брать новые обязательства.
				</div>
			)}
		</div>
	)
}

const Card = ({ title, value }: { title: string; value: number }) => (
	<div className='border rounded-xl p-3'>
		<div className='text-sm text-muted-foreground'>{title}</div>
		<div className='text-lg font-bold'>{value.toLocaleString('ru-RU')}</div>
	</div>
)
