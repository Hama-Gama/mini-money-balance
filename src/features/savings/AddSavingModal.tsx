import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

type Props = {
	open: boolean
	onClose: () => void
	onSubmit: (title: string, target: number, current: number) => void
}

export const AddSavingModal = ({ open, onClose, onSubmit }: Props) => {
	const [title, setTitle] = useState('')
	const [target, setTarget] = useState('')
	const [current, setCurrent] = useState('')

	if (!open) return null

	return (
		<div className='fixed inset-0 bg-black/40 z-50'>
			<div className='absolute top-4 left-1/2 -translate-x-1/2 bg-white rounded-xl p-4 w-[90%] max-w-sm space-y-3'>
				<h3 className='text-lg font-semibold'>Новая цель</h3>

				<Input
					placeholder='Название'
					value={title}
					onChange={e => setTitle(e.target.value)}
				/>

				<Input
					type='number'
					placeholder='Цель'
					value={target}
					onChange={e => setTarget(e.target.value)}
				/>

				<Input
					type='number'
					placeholder='Уже есть'
					value={current}
					onChange={e => setCurrent(e.target.value)}
				/>

				<div className='flex gap-2 pt-2'>
					<Button
						className='flex-1'
						onClick={() => {
							if (!title || !target) return
							onSubmit(title, Number(target), Number(current || 0))
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
