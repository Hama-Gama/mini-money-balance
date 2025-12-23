import { useEffect, useState } from 'react'
import { nanoid } from 'nanoid'

type Income = {
	id: string
	title: string
	amount: number
}

const STORAGE_KEY = 'incomes'

export const IncomeList = () => {
	const [incomes, setIncomes] = useState<Income[]>(() => {
		const saved = localStorage.getItem(STORAGE_KEY)
		return saved ? JSON.parse(saved) : []
	})

	const total = incomes.reduce((s, i) => s + i.amount, 0)

	useEffect(() => {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(incomes))
	}, [incomes])

	return (
		<div className='space-y-4'>
			<div className='text-right font-bold text-xl'>
				{total.toLocaleString('ru-RU')}
			</div>

			{incomes.map(i => (
				<div key={i.id} className='flex justify-between border-b py-2'>
					<span>{i.title}</span>
					<span>{i.amount}</span>
				</div>
			))}
		</div>
	)
}
