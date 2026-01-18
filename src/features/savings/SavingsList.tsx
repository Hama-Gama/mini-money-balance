import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { FiPlus } from 'react-icons/fi'
import { useSavingsStore } from './savings.store'
import { AddSavingModal } from './AddSavingModal'
import { getMonthKey } from '@/shared/utils/month'

export const SavingsList = () => {
	const { savings, addSaving, addToSaving, removeSaving, getMonthlyTotal } =
		useSavingsStore()

	const [openAdd, setOpenAdd] = useState(false)

	const month = getMonthKey()
	const total = getMonthlyTotal(month)

	const handleRemove = (id: string) => {
		if (!window.confirm('Удалить цель?')) return
		removeSaving(id)
	}

	return (
		<div className='space-y-4 pb-20'>
			{/* Header */}
			<div className='flex items-center justify-between mt-4'>
				<h2 className='text-xl font-bold'>Сбережения</h2>
				<button className='bg-black text-white text-xl font-bold py-1 px-5 rounded-xl'>
					{total.toLocaleString('ru-RU')}
				</button>
			</div>

			{/* List */}
			<div className='space-y-2'>
				{savings.map(saving => {
					const progress =
						saving.target > 0
							? Math.min((saving.current / saving.target) * 100, 100)
							: 0

					return (
						<div
							key={saving.id}
							className='rounded-sm border bg-background px-4 py-3 shadow-sm'
						>
							<div className='flex justify-between text-xl font-medium'>
								<span>{saving.title}</span>
								<span>
									{saving.current.toLocaleString('ru-RU')} /{' '}
									{saving.target.toLocaleString('ru-RU')}
								</span>
							</div>

							<div className='h-2 bg-muted rounded-full overflow-hidden mt-2'>
								<div
									className='h-full bg-black transition-all'
									style={{ width: `${progress}%` }}
								/>
							</div>

							<div className='flex justify-between items-center mt-3'>
								<Button
									size='sm'
									variant='outline'
									onClick={() => addToSaving(saving.id, 1000)}
								>
									+ 1 000
								</Button>
								<Button
									size='sm'
									variant='outline'
									onClick={() => addToSaving(saving.id, 2000)}
								>
									+ 2 000
								</Button>
								<Button
									size='sm'
									variant='outline'
									onClick={() => addToSaving(saving.id, 5000)}
								>
									+ 5 000
								</Button>
								<Button
									size='sm'
									variant='outline'
									onClick={() => addToSaving(saving.id, 10000)}
								>
									+ 10 000
								</Button>

								<Button
									size='icon'
									variant='ghost'
									onClick={() => handleRemove(saving.id)}
								>
									🗑
								</Button>
							</div>
						</div>
					)
				})}
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

			<AddSavingModal
				open={openAdd}
				onClose={() => setOpenAdd(false)}
				onSubmit={addSaving}
			/>
		</div>
	)
}
