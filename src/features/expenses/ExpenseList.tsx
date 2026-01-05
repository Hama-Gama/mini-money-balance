import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useExpensesStore } from '@/features/expenses/expenses.store'
import { FiPlus } from 'react-icons/fi'
import { AddExpenseModal } from './AddExpenseModal'
import type { ExpenseCategory } from './types'

export const ExpenseList = () => {
	const { expenses, addExpenseByTitle, removeCategory, getTotal } =
		useExpensesStore()

	const [openAdd, setOpenAdd] = useState(false)
	const [selectedCategory, setSelectedCategory] =
		useState<ExpenseCategory | null>(null)

	const total = getTotal()

	const handleDelete = (id: string) => {
		if (!window.confirm('Удалить категорию?')) return
		removeCategory(id)
	}

	return (
		<div className='space-y-4 pb-20'>
			{/* Total */}
			<div className='w-full flex justify-end'>
				<button className='bg-black text-white text-xl font-bold py-1 px-5 rounded-xl'>
					{total.toLocaleString('ru-RU')}
				</button>
			</div>

			{/* Список категорий */}
			<div>
				{expenses.map(item => (
					<div
						key={item.id}
						onClick={() => {
							setSelectedCategory(item)
							setOpenAdd(true)
						}}
						className='
							text-xl
							flex
							justify-between
							items-center
							cursor-pointer
							px-3
							py-2
							hover:bg-muted
							border-b
							last:border-b-0
						'
					>
						<span className='flex-1'>{item.title}</span>

						<Button
							size='icon'
							variant='ghost'
							onClick={e => {
								e.stopPropagation()
								handleDelete(item.id)
							}}
						>
							🗑
						</Button>
						
						<span className='font-medium min-w-[90px] text-right'>
							{item.amount.toLocaleString('ru-RU')}
						</span>

					</div>
				))}
			</div>

			{/* Floating + */}
			<button
				onClick={() => {
					setSelectedCategory(null)
					setOpenAdd(true)
				}}
				className='
					fixed
					bottom-20
					left-1/2
					-translate-x-1/2
					w-14
					h-14
					rounded-full
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
				<FiPlus size={28} />
			</button>

			{/* Modal */}
			<AddExpenseModal
				open={openAdd}
				category={selectedCategory}
				onClose={() => {
					setOpenAdd(false)
					setSelectedCategory(null)
				}}
				onSubmit={(amount, title) => {
					if (selectedCategory) {
						addExpenseByTitle(selectedCategory.title, amount)
					} else if (title) {
						addExpenseByTitle(title, amount)
					}
				}}
			/>
		</div>
	)
}
