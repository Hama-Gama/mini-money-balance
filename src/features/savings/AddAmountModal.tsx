import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

type Props = {
	open: boolean
	onClose: () => void
	onSubmit: (amount: number) => void
}

export const AddAmountModal = ({ open, onClose, onSubmit }: Props) => {
	const [amount, setAmount] = useState('')

	if (!open) return null

	return (
		<div className='fixed inset-0 bg-black/40 z-50'>
			<div className='absolute top-4 left-1/2 -translate-x-1/2 bg-white rounded-xl p-4 w-[90%] max-w-sm space-y-3'>
				<h3 className='text-lg font-semibold'>Добавить сумму</h3>

				<Input
					autoFocus
					type='number'
					placeholder='Сумма'
					value={amount}
					onChange={e => setAmount(e.target.value)}
				/>

				<div className='flex gap-2'>
					<Button
						className='flex-1'
						onClick={() => {
							if (!amount) return
							onSubmit(Number(amount))
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
