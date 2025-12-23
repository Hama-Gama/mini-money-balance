import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useCreditsStore } from './credits.store'

export const CreditList = () => {
	const { credits, addCredit, payCredit, getTotalDebt, removeCredit } =
		useCreditsStore()

	const [title, setTitle] = useState('')
	const [amount, setAmount] = useState('')

	const handleAdd = () => {
		if (!title || !amount) return
		addCredit(title, Number(amount))
		setTitle('')
		setAmount('')
	}

	return (
		<div className='space-y-4'>
			{/* Header */}
			<div className='flex items-center justify-between'>
				<h2 className='text-xl font-bold'>Кредиты</h2>
				<span className='font-semibold text-muted-foreground'>
					Долг: {getTotalDebt().toLocaleString('ru-RU')}
				</span>
			</div>

			{/* Список кредитов */}
			{credits.map(credit => {
				const rest = credit.amount - credit.paid
				const progress =
					credit.amount > 0
						? Math.min((credit.paid / credit.amount) * 100, 100)
						: 0

				return (
					<div key={credit.id} className='border rounded-xl p-3 space-y-2'>
						<div className='flex justify-between font-semibold'>
							<span>{credit.title}</span>
							<span>{rest.toLocaleString('ru-RU')}</span>
						</div>

						{/* Прогресс */}
						<div className='h-2 bg-muted rounded-full overflow-hidden'>
							<div
								className='h-full bg-black transition-all'
								style={{ width: `${progress}%` }}
							/>
						</div>

						<div className='text-sm text-muted-foreground'>
							Выплачено: {credit.paid.toLocaleString('ru-RU')} из{' '}
							{credit.amount.toLocaleString('ru-RU')}
						</div>

						<div className='flex gap-2'>
							<Button
								size='sm'
								variant='outline'
								onClick={() => payCredit(credit.id, 1000)}
							>
								+ 1 000
							</Button>

							<Button
								size='sm'
								variant='ghost'
								onClick={() => removeCredit(credit.id)}
							>
								🗑
							</Button>
						</div>
					</div>
				)
			})}

			{/* Добавление кредита */}
			<div className='flex gap-2 pt-2'>
				<Input
					placeholder='Название кредита'
					value={title}
					onChange={e => setTitle(e.target.value)}
				/>
				<Input
					type='number'
					placeholder='Сумма'
					value={amount}
					onChange={e => setAmount(e.target.value)}
				/>
				<Button onClick={handleAdd}>Добавить</Button>
			</div>
		</div>
	)
}
