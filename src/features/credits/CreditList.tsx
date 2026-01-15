import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { FiPlus } from 'react-icons/fi'
import { useCreditsStore } from './credits.store'
import { AddCreditModal } from './AddCreditModal'
import { useIncomesStore } from '@/features/incomes/incomes.store'
import { getMonthKey } from '@/shared/utils/month'


export const CreditList = () => {
	const { credits, addCredit, removeCredit } = useCreditsStore()

	const [openAdd, setOpenAdd] = useState(false)

	const handleDelete = (id: string) => {
		if (!window.confirm('Удалить кредит?')) return
		removeCredit(id)
	}

	const { getMonthlyTotal } = useIncomesStore()

	const month = getMonthKey()
	const incomeTotal = getMonthlyTotal(month)

	// общая сумма кредитов
	const creditsTotal = credits.reduce((sum, c) => sum + c.amount, 0)

	// процент от дохода
	const creditPercent =
		incomeTotal > 0 ? Math.round((creditsTotal / incomeTotal) * 100) : 0

	const isDanger = creditPercent > 15

	return (
		<div className='space-y-4 pb-20'>
			{/* Кредиты */}
			<div className='w-full flex items-center justify-between mt-4'>
				<h2 className='text-xl font-bold'>Кредиты</h2>

				<div className='flex flex-col items-end'>
					<button className='bg-black text-white text-xl font-bold py-1 px-5 rounded-xl'>
						{`- ${creditsTotal.toLocaleString('ru-RU')}`}
					</button>

					<span
						className={`text-sm font-semibold ${
							isDanger ? 'text-red-600' : 'text-muted-foreground'
						}`}
					>
						{creditPercent}% от дохода
					</span>
				</div>
			</div>

			{/* List */}
			<div className='space-y-3'>
				{credits.map(item => (
					<div
						key={item.id}
						className='
							flex
							items-center
							justify-between
							rounded-xl
							border
							bg-white
							px-4
							py-3
							text-lg
							shadow-sm
							transition
							hover:shadow-md
						'
					>
						{/* Title */}
						<span className='flex-1 font-medium'>{item.title}</span>

						{/* Delete */}
						<Button
							size='icon'
							variant='ghost'
							className='mx-2 text-muted-foreground hover:text-red-600'
							onClick={() => handleDelete(item.id)}
						>
							🗑
						</Button>

						{/* Amount */}
						<span className='min-w-[90px] text-right font-semibold'>
							{item.amount.toLocaleString('ru-RU')}
						</span>
					</div>
				))}
			</div>

			{/* Floating + */}
			<button
				onClick={() => setOpenAdd(true)}
				className='
					fixed
					bottom-20
					left-1/2
					-translate-x-1/2
					w-14
					h-14
					rounded-full
					bg-black
					text-white
					flex
					items-center
					justify-center
					shadow-lg
					z-50
					active:scale-95
					transition
				'
			>
				<FiPlus size={28} />
			</button>

			<AddCreditModal
				open={openAdd}
				onClose={() => setOpenAdd(false)}
				onSubmit={addCredit}
			/>
		</div>
	)
}
