import { useState } from 'react'
import type { ExpenseCategory } from '@/features/expenses/types'
import { Button } from '@/components/ui/button'
import { useExpensesStore } from '@/features/expenses/expenses.store'
import { FiPlus } from 'react-icons/fi'
import { AddExpenseModal } from './AddExpenseModal'


export const ExpenseList = () => {
	const { expenses, addExpenseByTitle, removeCategory, getTotal } =
		useExpensesStore()


	const [selected, setSelected] = useState<ExpenseCategory | null>(null)
	const [openAdd, setOpenAdd] = useState(false)

	const total = getTotal()

	const handleDelete = (id: string) => {
		if (!window.confirm('Удалить категорию?')) return
		removeCategory(id)
	}


	return (
		<div className='space-y-4 pb-20'>
			{/* Total */}
			<div className='w-full flex justify-end'>
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

			{/* Список категорий */}
			<div>
				{expenses.map(item => (
					<div
						key={item.id}
						onClick={() => setSelected(item)}
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

						<span className='font-medium min-w-[90px] text-right'>
							{item.amount.toLocaleString('ru-RU')}
						</span>

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
					</div>
				))}
			</div>

			{/* Floating + button */}
			<button
				onClick={() => setOpenAdd(true)}
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

			<AddExpenseModal
				open={openAdd}
				onClose={() => setOpenAdd(false)}
				onSubmit={(title, amount) => {
					addExpenseByTitle(title, amount)
				}}
			/>
		</div>
	)
}
