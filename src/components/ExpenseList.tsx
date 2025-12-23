import { useEffect, useState } from 'react'
import type { ExpenseCategory } from '@/types'
import { AddExpenseDialog } from './AddExpenseDialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { nanoid } from 'nanoid'

const STORAGE_KEY = 'expenses'

export const ExpenseList = () => {
	const [expenses, setExpenses] = useState<ExpenseCategory[]>(() => {
		const saved = localStorage.getItem(STORAGE_KEY)
		if (saved) {
			try {
				return JSON.parse(saved)
			} catch {
				return []
			}
		}
		return [
			{ id: nanoid(), title: 'Продукты - Дом', amount: 35000 },
			{ id: nanoid(), title: 'Еда - работа', amount: 25000 },
			{ id: nanoid(), title: 'Еда - улица', amount: 15000 },
			{ id: nanoid(), title: 'Кафе', amount: 12000 },
			{ id: nanoid(), title: 'Сотовая связь', amount: 1000 },
			{ id: nanoid(), title: 'Одежда', amount: 15000 },
		]
	})

	const [selected, setSelected] = useState<ExpenseCategory | null>(null)
	const [newCategory, setNewCategory] = useState('')

	const deleteExpense = (id: string) => {
		const confirmed = window.confirm('Удалить категорию?')
		if (!confirmed) return

		setExpenses(prev => prev.filter(e => e.id !== id))
	}


	const total = expenses.reduce((sum, e) => sum + e.amount, 0)

	// ✅ сохранение в localStorage
	useEffect(() => {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses))
	}, [expenses])

	return (
		<div className='space-y-4'>
			<div
				className='
    text-xl
    font-bold
    flex
    justify-between
    px-3
    pb-2
    border-b
  '
			>
				<span>Итого</span>
				<span>{total.toLocaleString('ru-RU')}</span>
			</div>

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
								e.stopPropagation() // ❗ не открывать диалог
								deleteExpense(item.id)
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

			<div className='flex gap-2'>
				<Input
					placeholder='Новая категория'
					value={newCategory}
					onChange={e => setNewCategory(e.target.value)}
					className='text-xl flex-1 p-2'
				/>
				<Button
					onClick={() => {
						if (!newCategory) return
						setExpenses(prev => [
							...prev,
							{ id: nanoid(), title: newCategory, amount: 0 },
						])
						setNewCategory('')
					}}
				>
					Добавить
				</Button>
			</div>

			{selected && (
				<AddExpenseDialog
					open
					title={selected.title}
					onClose={() => setSelected(null)}
					onSubmit={amount => {
						setExpenses(prev =>
							prev.map(e =>
								e.id === selected.id ? { ...e, amount: e.amount + amount } : e
							)
						)
					}}
				/>
			)}
		</div>
	)
}
