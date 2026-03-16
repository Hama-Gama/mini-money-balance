import { memo, useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { useExpensesStore } from '@/features/expenses/expenses.store'
import { FiPlus, FiTrash2, FiMoreVertical, FiEdit2 } from 'react-icons/fi'
import { AddExpenseModal } from './AddExpenseModal'
import type { ExpenseCategory } from './types'
import {
	DragDropContext,
	Droppable,
	Draggable,
	type DropResult,
} from '@hello-pangea/dnd'

const reorder = (
	list: ExpenseCategory[],
	startIndex: number,
	endIndex: number,
) => {
	const result = Array.from(list)
	const [removed] = result.splice(startIndex, 1)
	result.splice(endIndex, 0, removed)
	return result
}

type ExpenseRowProps = {
	item: ExpenseCategory
	onOpen: (item: ExpenseCategory) => void
	onDelete: (id: string) => void
	onEdit: (item: ExpenseCategory) => void
	dragHandleProps?: any
	isDragging?: boolean
	openMenuId: string | null
	setOpenMenuId: React.Dispatch<React.SetStateAction<string | null>>
}

const ExpenseRow = memo(
	({
		item,
		onOpen,
		onDelete,
		onEdit,
		dragHandleProps,
		isDragging = false,
		openMenuId,
		setOpenMenuId,
	}: ExpenseRowProps) => {
		const isMenuOpen = openMenuId === item.id

		return (
			<div
				onClick={() => {
					setOpenMenuId(null)
					onOpen(item)
				}}
				className={`relative flex items-center justify-between rounded-sm border px-4 py-2 text-lg cursor-pointer shadow-sm hover:shadow-md ${
					isDragging ? 'bg-zinc-100' : 'bg-white'
				} ${isDragging ? '' : 'transition'} ${isMenuOpen ? 'z-30' : 'z-0'}`}
				style={{
					opacity: isDragging ? 0.98 : 1,
				}}
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

				<span
					className='flex-1 min-w-0 break-words font-medium'
					title={item.title}
					style={{
						display: '-webkit-box',
						WebkitLineClamp: 2,
						WebkitBoxOrient: 'vertical',
						overflow: 'hidden',
					}}
				>
					{item.title}
				</span>

				<span className='min-w-[90px] text-right font-semibold'>
					{item.amount.toLocaleString('ru-RU')}
				</span>

				<div className='relative ml-2'>
					<button
						onClick={e => {
							e.stopPropagation()
							setOpenMenuId(prev => (prev === item.id ? null : item.id))
						}}
						className='text-zinc-500'
						aria-label='Открыть меню'
						title='Открыть меню'
					>
						<FiMoreVertical size={18} />
					</button>

					{isMenuOpen && (
						<div
							className='absolute right-0 top-full z-50 mt-2 min-w-[160px] rounded-sm border bg-white shadow-lg'
							onClick={e => e.stopPropagation()}
						>
							<button
								onClick={() => {
									setOpenMenuId(null)
									onEdit(item)
								}}
								className='flex w-full items-center gap-2 px-3 py-2 text-left'
							>
								<FiEdit2 size={16} />
								<span>Редактировать</span>
							</button>

							<button
								onClick={() => {
									setOpenMenuId(null)
									onDelete(item.id)
								}}
								className='flex w-full items-center gap-2 px-3 py-2 text-left text-red-600'
							>
								<FiTrash2 size={16} />
								<span>Удалить</span>
							</button>
						</div>
					)}
				</div>
			</div>
		)
	},
)

export const ExpenseList = () => {
	const {
		expenses,
		addExpenseByTitle,
		removeCategory,
		renameCategory,
		getTotal,
		resetAll,
		reorderExpenses,
	} = useExpensesStore()

	const [openAdd, setOpenAdd] = useState(false)
	const [selectedCategory, setSelectedCategory] =
		useState<ExpenseCategory | null>(null)
	const [editingCategory, setEditingCategory] =
		useState<ExpenseCategory | null>(null)
	const [resetCountdown, setResetCountdown] = useState<number | null>(null)
	const [openResetModal, setOpenResetModal] = useState(false)
	const [openMenuId, setOpenMenuId] = useState<string | null>(null)

	const total = getTotal()
	const totalMenuId = 'total-menu'

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

	const handleEdit = (item: ExpenseCategory) => {
		setSelectedCategory(null)
		setEditingCategory(item)
		setOpenAdd(true)
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

		if (
			result.destination.droppableId === result.source.droppableId &&
			result.destination.index === result.source.index
		) {
			return
		}

		const items = reorder(
			expenses,
			result.source.index,
			result.destination.index,
		)

		reorderExpenses(items)
	}

	return (
		<div
			className='space-y-4 pb-28'
			onClick={() => {
				setOpenMenuId(null)
			}}
		>
			<div className='w-full flex justify-end mt-4'>
				<div className='relative'>
					<div className='bg-white text-black text-xl font-bold py-1 px-5 rounded-sm shadow-sm flex items-center gap-2'>
						<span>{`- ${total.toLocaleString('ru-RU')}`}</span>

						<div className='relative'>
							<button
								onClick={e => {
									e.stopPropagation()
									setOpenMenuId(prev =>
										prev === totalMenuId ? null : totalMenuId,
									)
								}}
								className='text-zinc-500'
								aria-label='Открыть меню'
								title='Открыть меню'
							>
								<FiMoreVertical size={18} />
							</button>

							{openMenuId === totalMenuId && (
								<div
									className='absolute right-0 top-full z-20 mt-2 min-w-[140px] rounded-sm border bg-white shadow-lg'
									onClick={e => e.stopPropagation()}
								>
									<button
										onClick={() => {
											setOpenMenuId(null)
											handleResetClick()
										}}
										className='flex w-full items-center gap-2 px-3 py-2 text-left text-red-600'
									>
										<FiTrash2 size={16} />
										<span>Удалить</span>
									</button>
								</div>
							)}
						</div>
					</div>
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

			<DragDropContext
				onDragStart={() => setOpenMenuId(null)}
				onDragEnd={handleDragEnd}
			>
				<Droppable droppableId='expenses'>
					{provided => (
						<div
							ref={provided.innerRef}
							{...provided.droppableProps}
							className='space-y-2'
						>
							{expenses.map((item, index) => {
								const isMenuOpen = openMenuId === item.id

								return (
									<Draggable
										key={item.id}
										draggableId={item.id}
										index={index}
										disableInteractiveElementBlocking
									>
										{(providedDraggable, snapshot) => (
											<div
												ref={providedDraggable.innerRef}
												{...providedDraggable.draggableProps}
												className='relative'
												style={{
													userSelect: 'none',
													willChange: 'transform',
													zIndex: snapshot.isDragging
														? 40
														: isMenuOpen
															? 30
															: 'auto',
													...providedDraggable.draggableProps.style,
												}}
											>
												<ExpenseRow
													item={item}
													onOpen={item => {
														setEditingCategory(null)
														setSelectedCategory(item)
														setOpenAdd(true)
													}}
													onDelete={handleDelete}
													onEdit={handleEdit}
													dragHandleProps={providedDraggable.dragHandleProps}
													isDragging={snapshot.isDragging}
													openMenuId={openMenuId}
													setOpenMenuId={setOpenMenuId}
												/>
											</div>
										)}
									</Draggable>
								)
							})}
							{provided.placeholder}
						</div>
					)}
				</Droppable>
			</DragDropContext>

			<button
				onClick={() => {
					setEditingCategory(null)
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
				editCategory={editingCategory}
				onClose={() => {
					setOpenAdd(false)
					setSelectedCategory(null)
					setEditingCategory(null)
				}}
				onSubmit={(amount, title) => {
					if (editingCategory && title) {
						renameCategory(editingCategory.id, title.trim().slice(0, 30))
					} else if (selectedCategory) {
						addExpenseByTitle(selectedCategory.title, amount)
					} else if (title) {
						addExpenseByTitle(title.trim().slice(0, 30), amount)
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
