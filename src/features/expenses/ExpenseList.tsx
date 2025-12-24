import { useState } from 'react'
import type { ExpenseCategory } from '@/features/expenses/types'
import { AddExpenseDialog } from '@/features/expenses/AddExpenseDialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useExpensesStore } from '@/features/expenses/expenses.store'

export const ExpenseList = () => {
	const { expenses, addCategory, addExpense, removeCategory, getTotal } =
		useExpensesStore()

	const [selected, setSelected] = useState<ExpenseCategory | null>(null)
	const [newCategory, setNewCategory] = useState('')

	const total = getTotal()

	const handleAddCategory = () => {
		if (!newCategory) return
		addCategory(newCategory)
		setNewCategory('')
	}

	const handleDelete = (id: string) => {
		const confirmed = window.confirm('Удалить категорию?')
		if (!confirmed) return
		removeCategory(id)
	}

	return (
		<div className='space-y-4'>
			{/* Total */}
			<div className='w-full px-0 flex justify-end'>
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

			{/* Добавление категории */}
			<div className='flex gap-2'>
				<Input
					placeholder='Новая категория'
					value={newCategory}
					onChange={e => setNewCategory(e.target.value)}
					className='text-xl flex-1 p-2'
				/>
				<Button onClick={handleAddCategory}>Добавить</Button>
			</div>

			{/* Диалог добавления расхода */}
			{selected && (
				<AddExpenseDialog
					open
					title={selected.title}
					onClose={() => setSelected(null)}
					onSubmit={amount => {
						addExpense(selected.id, amount)
						setSelected(null)
					}}
				/>
			)}
		</div>
	)
}
