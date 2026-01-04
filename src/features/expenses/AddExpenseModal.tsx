import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

type Props = {
	open: boolean
	onClose: () => void
	onSubmit: (title: string, amount: number) => void
}

export const AddExpenseModal = ({ open, onClose, onSubmit }: Props) => {
	const [title, setTitle] = useState('')
	const [amount, setAmount] = useState('')

	if (!open) return null

	return (
		<div className='fixed inset-0 bg-black/40 flex items-center justify-center z-50'>
			<div className='bg-white rounded-xl p-4 w-[90%] max-w-sm space-y-3'>
				<h3 className='text-lg font-semibold'>Новый расход</h3>

				<Input
					placeholder='Название'
					value={title}
					onChange={e => setTitle(e.target.value)}
				/>

				<Input
					type='number'
					placeholder='Сумма'
					value={amount}
					onChange={e => setAmount(e.target.value)}
				/>

				<div className='flex gap-2 pt-2'>
					<Button
						className='flex-1'
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
		</div>
	)
}
