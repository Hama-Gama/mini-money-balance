import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { ExpenseCategory } from './types'

type Props = {
	open: boolean
	category: ExpenseCategory | null
	onClose: () => void
	onSubmit: (amount: number, title?: string) => void
}

export const AddExpenseModal = ({
	open,
	category,
	onClose,
	onSubmit,
}: Props) => {
	const [title, setTitle] = useState('')
	const [amount, setAmount] = useState('')

	if (!open) return null

	const handleSubmit = () => {
		if (!amount) return
		if (!category && !title) return

		if (category) {
			onSubmit(Number(amount))
		} else {
			onSubmit(Number(amount), title)
		}

		setTitle('')
		setAmount('')
		onClose()
	}

	return (
		<div className='fixed inset-0 bg-black/40 z-50'>
			<div
				className='
					absolute
					top-4
					left-1/2
					-translate-x-1/2
					bg-white
					rounded-xl
					p-4
					w-[90%]
					max-w-sm
					space-y-3
				'
			>
				<h3 className='text-lg font-semibold'>
					{category ? category.title : 'Новая категория'}
				</h3>

				{/* Название — ТОЛЬКО для новой категории */}
				{!category && (
					<Input
						autoFocus
						placeholder='Название категории'
						value={title}
						onChange={e => setTitle(e.target.value)}
					/>
				)}

				{/* СУММА — ВСЕГДА */}
				<Input
					autoFocus={!!category}
					type='number'
					placeholder='Сумма'
					value={amount}
					onChange={e => setAmount(e.target.value)}
				/>

				<div className='flex gap-2 pt-2'>
					<Button className='flex-1' onClick={handleSubmit}>
						Добавить
					</Button>

					<Button variant='outline' onClick={onClose}>
						Отмена
					</Button>
				</div>
			</div>
		</div>
	)
}
