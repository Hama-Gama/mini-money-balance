import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { Saving } from './types'

type Props = {
	open: boolean
	saving: Saving
	onClose: () => void
	onSubmit: (title: string, target: number) => void
}

export const EditSavingModal = ({ open, saving, onClose, onSubmit }: Props) => {
	const [title, setTitle] = useState(saving.title)
	const [target, setTarget] = useState(String(saving.target))

	if (!open) return null

	return (
		<div className='fixed inset-0 bg-black/40 z-50'>
			<div className='absolute top-4 left-1/2 -translate-x-1/2 bg-white rounded-xl p-4 w-[90%] max-w-sm space-y-3'>
				<h3 className='text-lg font-semibold'>Редактировать</h3>

				<Input value={title} onChange={e => setTitle(e.target.value)} />
				<Input
					type='number'
					value={target}
					onChange={e => setTarget(e.target.value)}
				/>

				<div className='flex gap-2'>
					<Button
						className='flex-1'
						onClick={() => {
							onSubmit(title, Number(target))
							onClose()
						}}
					>
						Сохранить
					</Button>

					<Button variant='outline' onClick={onClose}>
						Отмена
					</Button>
				</div>
			</div>
		</div>
	)
}
