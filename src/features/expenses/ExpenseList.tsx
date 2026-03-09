import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { useExpensesStore } from '@/features/expenses/expenses.store'
import { FiPlus, FiTrash2 } from 'react-icons/fi'
import { AddExpenseModal } from './AddExpenseModal'
import type { ExpenseCategory } from './types'
import {
	DragDropContext,
	Droppable,
	Draggable,
	type DropResult,
} from '@hello-pangea/dnd'

type ExpenseRowProps = {
	item: ExpenseCategory
	onOpen: (item: ExpenseCategory) => void
	onDelete: (id: string) => void
	dragHandleProps?: any
	draggableProps?: any
	innerRef?: (element: HTMLDivElement | null) => void
	isDragging?: boolean
}

const ExpenseRow = ({
	item,
	onOpen,
	onDelete,
	dragHandleProps,
	draggableProps,
	innerRef,
	isDragging = false,
}: ExpenseRowProps) => {
	return (
		<div
			ref={innerRef}
			{...(draggableProps || {})}
			onClick={() => {
				onOpen(item)
			}}
			className='flex items-center justify-between rounded-sm border bg-white px-4 py-2 text-lg cursor-pointer transition hover:shadow-md shadow-sm'
			style={draggableProps?.style}
			data-dragging={isDragging ? 'true' : 'false'}
		>
			<div
				{...(dragHandleProps || {})}
				onClick={e => e.stopPropagation()}
				onPointerDown={e => e.stopPropagation()}
				className='mr-3 cursor-grab select-none text-zinc-400 active:cursor-grabbing touch-none'
				aria-label='Перетащить'
				title='Перетащить'
			>
				⋮⋮
			</div>

			<span className='flex-1 font-medium'>{item.title}</span>

			<Button
				size='icon'
				variant='ghost'
				className='mx-2 text-muted-foreground hover:text-red-600'
				onClick={e => {
					e.stopPropagation()
					onDelete(item.id)
				}}
			>
				🗑
			</Button>

			<span className='min-w-[90px] text-right font-semibold'>
				{item.amount.toLocaleString('ru-RU')}
			</span>
		</div>
	)
}

export const ExpenseList = () => {
	const {
		expenses,
		addExpenseByTitle,
		removeCategory,
		getTotal,
		resetAll,
		reorderExpenses,
	} = useExpensesStore()

	const [openAdd, setOpenAdd] = useState(false)
	const [selectedCategory, setSelectedCategory] =
		useState<ExpenseCategory | null>(null)
	const [resetCountdown, setResetCountdown] = useState<number | null>(null)
	const [openResetModal, setOpenResetModal] = useState(false)

	const total = getTotal()

	useEffect(() => {
		if (resetCountdown === null) return

		if (resetCountdown === 0) {
			resetAll()
			setResetCountdown(null)
			return
		}

		const timer = window.setTimeout(() => {
			setResetCountdown(prev => (prev === null ? null : prev - 1))
		}, 1000)

		return () => {
			window.clearTimeout(timer)
		}
	}, [resetCountdown, resetAll])

	const handleDelete = (id: string) => {
		if (!window.confirm('Удалить категорию?')) return
		removeCategory(id)
	}

	const handleResetClick = () => {
		if (resetCountdown !== null) return
		setOpenResetModal(true)
	}

	const handleResetConfirm = () => {
		setOpenResetModal(false)
		setResetCountdown(5)
	}

	const handleCancelReset = () => {
		setResetCountdown(null)
	}

	const handleDragEnd = (result: DropResult) => {
		if (!result.destination) return

		const oldIndex = result.source.index
		const newIndex = result.destination.index

		if (oldIndex === newIndex) return

		const updated = Array.from(expenses)
		const [movedItem] = updated.splice(oldIndex, 1)
		updated.splice(newIndex, 0, movedItem)

		reorderExpenses(updated)
	}

	return (
		<div className='space-y-4 pb-28'>
			<div className='w-full flex justify-end mt-4'>
				<div className='flex items-center gap-2'>
					<button
						onClick={handleResetClick}
						className='text-zinc-500 hover:text-red-600'
						aria-label='Сбросить все расходы'
						title='Сбросить все расходы'
					>
						<FiTrash2 size={20} />
					</button>

					<button className='bg-white text-black text-xl font-bold py-1 px-5 rounded-sm shadow-sm'>
						{`- ${total.toLocaleString('ru-RU')}`}
					</button>
				</div>
			</div>

			{resetCountdown !== null && (
				<div className='w-full flex justify-end'>
					<div className='flex items-center gap-3'>
						<span className='text-sm'>
							Все расходы будут сброшены на 0 через {resetCountdown} сек.
						</span>

						<Button
							onClick={handleCancelReset}
							className='bg-black text-white rounded-sm px-3 py-1 text-sm'
						>
							Отмена
						</Button>
					</div>
				</div>
			)}

			<DragDropContext onDragEnd={handleDragEnd}>
				<Droppable droppableId='expenses'>
					{provided => (
						<div
							ref={provided.innerRef}
							{...provided.droppableProps}
							className='space-y-2'
						>
							{expenses.map((item, index) => (
								<Draggable key={item.id} draggableId={item.id} index={index}>
									{(providedDraggable, snapshot) => (
										<ExpenseRow
											item={item}
											onOpen={item => {
												setSelectedCategory(item)
												setOpenAdd(true)
											}}
											onDelete={handleDelete}
											innerRef={providedDraggable.innerRef}
											draggableProps={providedDraggable.draggableProps}
											dragHandleProps={providedDraggable.dragHandleProps}
											isDragging={snapshot.isDragging}
										/>
									)}
								</Draggable>
							))}
							{provided.placeholder}
						</div>
					)}
				</Droppable>
			</DragDropContext>

			<button
				onClick={() => {
					setSelectedCategory(null)
					setOpenAdd(true)
				}}
				className='fixed bottom-20 left-1/2 -translate-x-1/2 w-14 h-14 rounded-full bg-black text-white flex items-center justify-center shadow-lg z-50 active:scale-95 transition'
			>
				<FiPlus size={28} />
			</button>

			<AddExpenseModal
				open={openAdd}
				category={selectedCategory}
				onClose={() => {
					setOpenAdd(false)
					setSelectedCategory(null)
				}}
				onSubmit={(amount, title) => {
					if (selectedCategory) {
						addExpenseByTitle(selectedCategory.title, amount)
					} else if (title) {
						addExpenseByTitle(title, amount)
					}
				}}
			/>

			{openResetModal && (
				<div className='fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4'>
					<div className='w-full max-w-sm rounded-sm bg-white p-4 shadow-lg'>
						<div className='text-base font-semibold'>
							Сбросить все расходы на 0?
						</div>

						<div className='mt-4 flex justify-end gap-2'>
							<Button
								variant='outline'
								onClick={() => setOpenResetModal(false)}
							>
								Отмена
							</Button>

							<Button variant='default' onClick={handleResetConfirm}>
								Сбросить
							</Button>
						</div>
					</div>
				</div>
			)}
		</div>
	)
}
