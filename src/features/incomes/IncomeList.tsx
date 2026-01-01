import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { AddIncomeDialog } from '@/features/incomes/AddIncomeDialog'
import { useIncomesStore } from '@/features/incomes/incomes.store'
import { getMonthKey } from '@/shared/utils/month'

export const IncomeList = () => {
	const { incomes, addIncome, removeIncome, getMonthlyTotal } =
		useIncomesStore()

	const [open, setOpen] = useState(false)

	const currentMonth = getMonthKey()
	const total = getMonthlyTotal(currentMonth)

	const sortedIncomes = incomes
		.filter(i => i.month === currentMonth)
		.sort((a, b) => b.amount - a.amount)

	const handleDelete = (id: string) => {
		if (!window.confirm('Удалить доход?')) return
		removeIncome(id)
	}

	return (
		<div className='space-y-4'>
			<div className='flex items-center justify-between'>
				<h2 className='text-xl font-bold'>Доходы</h2>
				<span className='font-bold'>{total.toLocaleString('ru-RU')}</span>
			</div>

			<div>
				{sortedIncomes.map(income => (
					<div
						key={income.id}
						className='flex justify-between items-center border-b py-2'
					>
						<div className='flex flex-col'>
							<span>{income.title}</span>
							<span className='text-xs text-muted-foreground'>
								{new Date(income.createdAt).toLocaleDateString('ru-RU')}
							</span>
						</div>

						<div className='flex items-center gap-2'>
							<span className='font-medium'>
								{income.amount.toLocaleString('ru-RU')}
							</span>

							<Button
								size='icon'
								variant='ghost'
								onClick={() => handleDelete(income.id)}
							>
								🗑
							</Button>
						</div>
					</div>
				))}
			</div>

			<Button onClick={() => setOpen(true)}>Добавить доход</Button>

			<AddIncomeDialog
				open={open}
				onClose={() => setOpen(false)}
				onSubmit={addIncome}
			/>
		</div>
	)
}
