import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { ExpenseCategory } from './types'

type Props = {
	open: boolean
	category: ExpenseCategory | null
	editCategory?: ExpenseCategory | null
	onClose: () => void
	onSubmit: (amount: number, title?: string) => void
}

const MAX_TITLE_LENGTH = 30
const MAX_AMOUNT_DIGITS = 9

const formatAmount = (value: string) => {
	const digits = value.replace(/\D/g, '').slice(0, MAX_AMOUNT_DIGITS)
	if (!digits) return ''
	return Number(digits).toLocaleString('ru-RU')
}

const getAmountDigits = (value: string) => value.replace(/\D/g, '')

export const AddExpenseModal = ({
	open,
	category,
	editCategory = null,
	onClose,
	onSubmit,
}: Props) => {
	const [title, setTitle] = useState('')
	const [amount, setAmount] = useState('')

	useEffect(() => {
		if (!open) return

		if (editCategory) {
			setTitle(editCategory.title)
			setAmount('')
			return
		}

		setTitle('')
		setAmount('')
	}, [open, editCategory])

	if (!open) return null

	const isEditMode = !!editCategory

	const handleSubmit = () => {
		if (isEditMode) {
			if (!title.trim()) return
			onSubmit(0, title.trim())
			onClose()
			return
		}

		const amountDigits = getAmountDigits(amount)

		if (!amountDigits) return
		if (!category && !title.trim()) return

		const parsedAmount = Number(amountDigits)

		if (category) {
			onSubmit(parsedAmount)
		} else {
			onSubmit(parsedAmount, title.trim())
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
					{isEditMode
						? 'Редактировать категорию'
						: category
							? category.title
							: 'Новая категория'}
				</h3>

				{(!category || isEditMode) && (
					<div className='space-y-1'>
						<Input
							autoFocus
							placeholder='Название категории'
							value={title}
							maxLength={MAX_TITLE_LENGTH}
							onChange={e => setTitle(e.target.value)}
							onKeyDown={e => {
								if (e.key === 'Enter' && isEditMode && title.trim()) {
									handleSubmit()
								}
								if (
									e.key === 'Enter' &&
									!isEditMode &&
									getAmountDigits(amount) &&
									title.trim()
								) {
									handleSubmit()
								}
							}}
							className='text-[24px]'
						/>

						<div className='text-xs text-zinc-400 text-right'>
							{title.length} / {MAX_TITLE_LENGTH}
						</div>
					</div>
				)}

				{!isEditMode && (
					<div className='space-y-1'>
						<Input
							autoFocus={!!category}
							type='text'
							inputMode='numeric'
							placeholder='Сумма'
							value={amount}
							onChange={e => setAmount(formatAmount(e.target.value))}
							onKeyDown={e => {
								if (
									e.key === 'Enter' &&
									getAmountDigits(amount) &&
									(category || title.trim())
								) {
									handleSubmit()
								}
							}}
							className='text-[24px]'
						/>

						<div className='text-xs text-zinc-400 text-right'>
							{getAmountDigits(amount).length} / {MAX_AMOUNT_DIGITS}
						</div>
					</div>
				)}

				<div className='flex gap-2 pt-2'>
					<Button
						className='flex-1'
						onClick={handleSubmit}
						disabled={
							isEditMode
								? !title.trim()
								: !getAmountDigits(amount) || (!category && !title.trim())
						}
					>
						{isEditMode ? 'Сохранить' : 'Добавить'}
					</Button>

					<Button variant='outline' onClick={onClose}>
						Отмена
					</Button>
				</div>
			</div>
		</div>
	)
}
