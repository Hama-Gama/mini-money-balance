

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { FiPlus, FiEdit2 } from 'react-icons/fi'
import { useSavingsStore } from './savings.store'
import { AddSavingModal } from './AddSavingModal'
import { AddAmountModal } from './AddAmountModal'
import { EditSavingModal } from './EditSavingModal'
import type { Saving } from './types'

export const SavingsList = () => {
	const {
		savings,
		addSaving,
		addAmount,
		updateSaving,
		removeSaving,
		getTotal,
	} = useSavingsStore()

	const [openAdd, setOpenAdd] = useState(false)
	const [openAmount, setOpenAmount] = useState(false)
	const [openEdit, setOpenEdit] = useState(false)
	const [selected, setSelected] = useState<Saving | null>(null)

	const total = getTotal()

	return (
		<div className='space-y-4 pb-24'>
			{/* Header */}
			<div className='flex justify-between mt-4'>
				<h2 className='text-xl font-bold'>Сбережения</h2>
				<button className='bg-black text-white text-xl font-bold py-1 px-5 rounded-xl'>
					{total.toLocaleString('ru-RU')}
				</button>
			</div>

			{/* List */}
			<div className='space-y-2'>
				{savings.map(s => {
					const progress =
						s.target > 0 ? Math.min((s.current / s.target) * 100, 100) : 0

					return (
						<div
							key={s.id}
							className='rounded-sm border bg-white px-4 py-3 shadow-sm'
						>
							<div className='flex justify-between text-lg font-medium'>
								<span>{s.title}</span>
								<span>
									{s.current.toLocaleString('ru-RU')} /{' '}
									{s.target.toLocaleString('ru-RU')}
								</span>
							</div>

							<div className='h-2 bg-muted rounded-full overflow-hidden mt-2'>
								<div
									className='h-full bg-black'
									style={{ width: `${progress}%` }}
								/>
							</div>

							<div className='flex justify-between mt-3'>
								<Button
									size='sm'
									onClick={() => {
										setSelected(s)
										setOpenAmount(true)
									}}
								>
									+ Добавить
								</Button>

								<div className='flex gap-2'>
									<Button
										size='icon'
										variant='ghost'
										onClick={() => {
											setSelected(s)
											setOpenEdit(true)
										}}
									>
										<FiEdit2 />
									</Button>

									<Button
										size='icon'
										variant='ghost'
										onClick={() => {
											if (confirm('Удалить цель?')) removeSaving(s.id)
										}}
									>
										🗑
									</Button>
								</div>
							</div>
						</div>
					)
				})}
			</div>

			{/* Floating + */}
			<button
				onClick={() => setOpenAdd(true)}
				className='fixed bottom-20 left-1/2 -translate-x-1/2 w-14 h-14 rounded-full bg-black text-white flex items-center justify-center shadow-lg'
			>
				<FiPlus size={28} />
			</button>

			{/* Modals */}
			<AddSavingModal
				open={openAdd}
				onClose={() => setOpenAdd(false)}
				onSubmit={addSaving}
			/>

			{selected && (
				<>
					<AddAmountModal
						open={openAmount}
						onClose={() => setOpenAmount(false)}
						onSubmit={amount => addAmount(selected.id, amount)}
					/>

					<EditSavingModal
						open={openEdit}
						saving={selected}
						onClose={() => setOpenEdit(false)}
						onSubmit={(title, target) =>
							updateSaving(selected.id, title, target)
						}
					/>
				</>
			)}
		</div>
	)
}
