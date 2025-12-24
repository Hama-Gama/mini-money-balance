import { useState } from 'react'
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

type Props = {
	open: boolean
	onClose: () => void
	onSubmit: (amount: number) => void
	title?: string
}

export const AddIncomeDialog = ({
	open,
	onClose,
	onSubmit,
	title = 'Добавить доход',
}: Props) => {
	const [value, setValue] = useState('')

	const handleSubmit = () => {
		const amount = Number(value)
		if (!amount) return
		onSubmit(amount)
		setValue('')
		onClose()
	}

	return (
		<Dialog open={open} onOpenChange={onClose}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{title}</DialogTitle>
				</DialogHeader>

				<Input
					type='number'
					placeholder='Введите сумму'
					value={value}
					onChange={e => setValue(e.target.value)}
					autoFocus
				/>

				<Button onClick={handleSubmit}>Добавить</Button>
			</DialogContent>
		</Dialog>
	)
}
