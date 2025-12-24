import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

type Props = {
	open: boolean
	onClose: () => void
	onSubmit: (title: string, amount: number) => void
}

export const AddIncomeDialog = ({ open, onClose, onSubmit }: Props) => {
	const [title, setTitle] = useState('')
	const [amount, setAmount] = useState('')

	if (!open) return null

	return (
		<div className='space-y-3'>
			<Input
				placeholder='Источник дохода (Зарплата, Фриланс...)'
				value={title}
				onChange={e => setTitle(e.target.value)}
			/>

			<Input
				type='number'
				placeholder='Сумма'
				value={amount}
				onChange={e => setAmount(e.target.value)}
			/>

			<div className='flex gap-2'>
				<Button
					onClick={() => {
						if (!title || !amount) return
						onSubmit(title, Number(amount))
						setTitle('')
						setAmount('')
						onClose()
					}}
				>
					Добавить
				</Button>

				<Button variant='outline' onClick={onClose}>
					Отмена
				</Button>
			</div>
		</div>
	)
}
