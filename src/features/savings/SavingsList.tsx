import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useSavingsStore } from '@/features/savings/savings.store'

export const SavingsList = () => {
	const { savings, addSaving, addToSaving, removeSaving, getMonthlyTotal } =
		useSavingsStore()

	const [title, setTitle] = useState('')
	const [target, setTarget] = useState('')
	const total = getMonthlyTotal()

	const handleRemove = (id: string) => {
		const confirmed = window.confirm('Удалить цель сбережений?')
		if (!confirmed) return

		removeSaving(id)
	}


	return (
		<div className='space-y-4'>
			{/* Header */}
			<div className='flex items-center justify-between'>
				<h2 className='text-xl font-bold'>Сбережения</h2>
				<span className='font-semibold text-muted-foreground'>
					Всего: {total.toLocaleString('ru-RU')}
				</span>
			</div>

			{/* Список целей */}
			{savings.map(saving => {
				const progress =
					saving.target > 0
						? Math.min((saving.current / saving.target) * 100, 100)
						: 0

				return (
					<div key={saving.id} className='border rounded-xl p-3 space-y-2'>
						<div className='flex justify-between font-semibold'>
							<span>{saving.title}</span>
							<span>
								{saving.current.toLocaleString('ru-RU')} /{' '}
								{saving.target.toLocaleString('ru-RU')}
							</span>
						</div>

						{/* Прогресс */}
						<div className='h-2 bg-muted rounded-full overflow-hidden'>
							<div
								className='h-full bg-black transition-all'
								style={{ width: `${progress}%` }}
							/>
						</div>

						<div className='flex gap-2'>
							<Button
								size='sm'
								variant='outline'
								onClick={() => addToSaving(saving.id, 1000)}
							>
								+ 1 000
							</Button>

							<Button
								size='sm'
								variant='ghost'
								onClick={() => handleRemove(saving.id)}
							>
								🗑
							</Button>
						</div>
					</div>
				)
			})}

			{/* Добавление цели */}
			<div className='flex gap-2 pt-2'>
				<Input
					placeholder='Цель'
					value={title}
					onChange={e => setTitle(e.target.value)}
				/>
				<Input
					type='number'
					placeholder='Сумма'
					value={target}
					onChange={e => setTarget(e.target.value)}
				/>
				<Button
					onClick={() => {
						if (!title || !target) return
						addSaving(title, Number(target))
						setTitle('')
						setTarget('')
					}}
				>
					Добавить
				</Button>
			</div>
		</div>
	)
}
