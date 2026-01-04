import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useCreditsStore } from './credits.store'
import { CreditCalendar } from './CreditCalendar'

export const CreditList = () => {
	const { credits, addCredit, payCredit, getTotalDebt, removeCredit } =
		useCreditsStore()

	const [title, setTitle] = useState('')
	const [amount, setAmount] = useState('')
	const [showCalendar, setShowCalendar] = useState(false)

	const handleAdd = () => {
		if (!title || !amount) return
		addCredit({
			bankName: title,
			totalAmount: Number(amount),
			monthlyPayment: Math.floor(Number(amount) / 12),
			overpayment: 0,
		})
		setTitle('')
		setAmount('')
	}

	const handleRemove = (id: string) => {
		if (!window.confirm('Удалить кредит?')) return
		removeCredit(id)
	}

	return (
		<div className='space-y-4'>
			<div className='flex items-center justify-between'>
				<h2 className='text-xl font-bold'>Кредиты</h2>
				<span className='font-semibold text-muted-foreground'>
					Долг: {getTotalDebt().toLocaleString('ru-RU')}
				</span>
			</div>

			{credits.map(credit => {
				const rest = credit.totalAmount - credit.paidAmount
				const progress =
					credit.totalAmount > 0
						? Math.min((credit.paidAmount / credit.totalAmount) * 100, 100)
						: 0

				return (
					<div key={credit.id} className='border rounded-xl p-3 space-y-2'>
						<div className='flex justify-between font-semibold'>
							<span>{credit.bankName}</span>
							<span>{rest.toLocaleString('ru-RU')}</span>
						</div>

						<div className='h-2 bg-muted rounded-full overflow-hidden'>
							<div
								className='h-full bg-black'
								style={{ width: `${progress}%` }}
							/>
						</div>

						<div className='text-sm text-muted-foreground space-y-1'>
							<div className='flex justify-between'>
								<span>Ежемесячный платёж</span>
								<span className='font-medium'>
									{credit.monthlyPayment.toLocaleString('ru-RU')}
								</span>
							</div>

							<div className='flex justify-between'>
								<span>Общая сумма</span>
								<span>{credit.totalAmount.toLocaleString('ru-RU')}</span>
							</div>

							{credit.overpayment > 0 && (
								<div className='flex justify-between text-orange-600'>
									<span>Переплата</span>
									<span>{credit.overpayment.toLocaleString('ru-RU')}</span>
								</div>
							)}
						</div>

						<div className='flex gap-2'>
							<Button
								size='sm'
								variant='outline'
								onClick={() => payCredit(credit.id, credit.monthlyPayment)}
							>
								Оплатить
							</Button>

							<Button
								size='sm'
								variant='ghost'
								onClick={() => handleRemove(credit.id)}
							>
								🗑
							</Button>
						</div>
					</div>
				)
			})}

			<Button
				variant='outline'
				className='w-full'
				onClick={() => setShowCalendar(v => !v)}
			>
				{showCalendar
					? 'Скрыть календарь платежей'
					: 'Показать календарь платежей'}
			</Button>

			{showCalendar && (
				<div className='pt-2'>
					<CreditCalendar />
				</div>
			)}

			<div className='flex gap-2 pt-2'>
				<Input
					placeholder='Банк'
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
