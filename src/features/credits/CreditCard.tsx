import { Button } from '@/components/ui/button'
import type { Credit } from './types'

type Props = {
	credit: Credit
	onPay: () => void
	onClose: () => void
	onRemove: () => void
}

export const CreditCard = ({ credit, onPay, onClose, onRemove }: Props) => {
	const rest = credit.totalAmount - credit.paidAmount
	const progress =
		credit.totalAmount > 0
			? Math.min((credit.paidAmount / credit.totalAmount) * 100, 100)
			: 0

	return (
		<div
			className={`border rounded-xl p-3 space-y-2 ${
				credit.isClosed ? 'opacity-60' : ''
			}`}
		>
			<div className='flex justify-between items-center'>
				<div className='flex items-center gap-2'>
					{credit.bankLogo && (
						<img src={credit.bankLogo} alt='' className='w-6 h-6 rounded' />
					)}
					<span className='font-semibold'>{credit.bankName}</span>
				</div>

				<span className='font-semibold'>{rest.toLocaleString('ru-RU')}</span>
			</div>

			<div className='h-2 bg-muted rounded-full overflow-hidden'>
				<div
					className='h-full bg-black transition-all'
					style={{ width: `${progress}%` }}
				/>
			</div>

			<div className='text-xs text-muted-foreground'>
				Платёж: {credit.monthlyPayment.toLocaleString('ru-RU')} · Осталось{' '}
				{credit.months - Math.floor(credit.paidAmount / credit.monthlyPayment)}{' '}
				мес.
			</div>

			<div className='flex gap-2'>
				{!credit.isClosed && (
					<Button size='sm' variant='outline' onClick={onPay}>
						Оплатить месяц
					</Button>
				)}

				{!credit.isClosed && (
					<Button size='sm' variant='ghost' onClick={onClose}>
						Погашено
					</Button>
				)}

				<Button size='sm' variant='ghost' onClick={onRemove}>
					🗑
				</Button>
			</div>



		

		</div>
	)
}
