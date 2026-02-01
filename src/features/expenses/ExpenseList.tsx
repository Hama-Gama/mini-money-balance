import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useExpensesStore } from '@/features/expenses/expenses.store'
import { FiPlus } from 'react-icons/fi'
import { AddExpenseModal } from './AddExpenseModal'
import type { ExpenseCategory } from './types'

export const ExpenseList = () => {
	const { expenses, addExpenseByTitle, removeCategory, getTotal, resetAll } =
		useExpensesStore()

	const [openAdd, setOpenAdd] = useState(false)
	const [selectedCategory, setSelectedCategory] =
		useState<ExpenseCategory | null>(null)

	const total = getTotal()

	const handleDelete = (id: string) => {
		if (!window.confirm('Удалить категорию?')) return
		removeCategory(id)
	}

	const handleReset = () => {
		if (!window.confirm('Вы уверены? Все суммы расходов будут сброшены.'))
			return
		resetAll()
	}

	return (
		<div className='space-y-4 pb-28'>
			{/* Total */}
			<div className='w-full flex justify-end mt-4'>
				<button className='bg-black text-white text-xl font-bold py-1 px-5 rounded-xl'>
					{`- ${total.toLocaleString('ru-RU')}`}
				</button>
			</div>

			{/* Список категорий */}
			<div className='space-y-2'>
				{expenses.map(item => (
					<div
						key={item.id}
						onClick={() => {
							setSelectedCategory(item)
							setOpenAdd(true)
						}}
						className='flex items-center justify-between rounded-sm border bg-white px-4 py-2 text-lg cursor-pointer shadow-sm transition hover:shadow-md'
					>
						<span className='flex-1 font-medium'>{item.title}</span>

						<Button
							size='icon'
							variant='ghost'
							className='mx-2 text-muted-foreground hover:text-red-600'
							onClick={e => {
								e.stopPropagation()
								handleDelete(item.id)
							}}
						>
							🗑
						</Button>

						<span className='min-w-[90px] text-right font-semibold'>
							{item.amount.toLocaleString('ru-RU')}
						</span>
					</div>
				))}
			</div>

			{/* Reset */}
			<Button
				variant='outline'
				className='w-full text-red-600 border-red-300 hover:bg-red-50'
				onClick={handleReset}
			>
				Сбросить все расходы
			</Button>

			{/* Floating + */}
			<button
				onClick={() => {
					setSelectedCategory(null)
					setOpenAdd(true)
				}}
				className='fixed bottom-20 left-1/2 -translate-x-1/2 w-14 h-14 rounded-full bg-black text-white flex items-center justify-center shadow-lg z-50 active:scale-95 transition'
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
