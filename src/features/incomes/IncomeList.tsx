import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { AddIncomeDialog } from '@/features/incomes/AddIncomeDialog'
import { useIncomesStore } from '@/features/incomes/incomes.store'
import { getMonthKey } from '@/shared/utils/month'
import { FiPlusCircle } from 'react-icons/fi'

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
		<div className='space-y-4 pb-20'>
			{/* Header */}
			<div className='flex items-center justify-between'>
				<h2 className='text-xl font-bold'>Доходы</h2>
				<span className='font-bold text-xl'>{total.toLocaleString('ru-RU')}</span>
			</div>

			{/* List */}
			<div>
				{sortedIncomes.map(income => (
					<div className='flex items-center border-b py-2 text-xl'>
						{/* Left — title */}
						<div className='flex-1 flex flex-col'>
							<span>{income.title}</span>
							<span className='text-xs text-muted-foreground'>
								{new Date(income.createdAt).toLocaleDateString('ru-RU')}
							</span>
						</div>

						{/* Center — delete */}
						<div className='flex justify-center w-12'>
							<Button
								size='icon'
								variant='ghost'
								onClick={() => handleDelete(income.id)}
							>
								🗑
							</Button>
						</div>

						{/* Right — amount */}
						<div className='flex-1 text-right font-medium text-xl'>
							{income.amount.toLocaleString('ru-RU')}
						</div>
					</div>
				))}
			</div>

			{/* Floating + */}
			<button
				onClick={() => setOpen(true)}
				className='
					fixed
					bottom-20
					left-1/2
					-translate-x-1/2
					w-14
					h-14
					rounded-lg
					bg-black
					text-white
					flex
					items-center
					justify-center
					shadow-lg
					z-50
					active:scale-95
					transition
				'
			>
				<FiPlusCircle size={32} />
			</button>

			{/* Dialog */}
			<AddIncomeDialog
				open={open}
				onClose={() => setOpen(false)}
				onSubmit={addIncome}
			/>
		</div>
	)
}
