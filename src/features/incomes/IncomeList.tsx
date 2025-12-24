import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { AddIncomeDialog } from '@/features/incomes/AddIncomeDialog'
import { useIncomesStore } from '@/features/incomes/incomes.store'



export const IncomeList = () => {
	const { incomes, addIncome, removeIncome, getTotal } = useIncomesStore()

	const handleDelete = (id: string) => {
		const confirmed = window.confirm('Удалить доход?')
		if (!confirmed) return

		removeIncome(id)
	}

	const [open, setOpen] = useState(false)

	const total = getTotal()

	return (
		<div className='space-y-4'>
			{/* Header */}
			<div className='flex items-center justify-between'>
				<h2 className='text-xl font-bold'>Доходы</h2>
				<button
					className='
            bg-black
            text-white
            text-xl
            font-bold
            py-1
            px-5
            rounded-xl
            tracking-wide
            shadow-sm
          '
				>
					{total.toLocaleString('ru-RU')}
				</button>
			</div>

			{/* Список доходов */}
			<div>
				{incomes.map(income => (
					<div
						key={income.id}
						className='flex justify-between items-center border-b py-2'
					>
						<span>{income.title}</span>

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

			{/* Добавить доход */}
			<Button onClick={() => setOpen(true)}>Добавить доход</Button>

			<AddIncomeDialog
				open={open}
				onClose={() => setOpen(false)}
				onSubmit={(title, amount) => addIncome(title, amount)}
			/>
		</div>
	)
}
