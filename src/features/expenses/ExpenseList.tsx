import { useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { useExpensesStore } from '@/features/expenses/expenses.store'
import { FiPlus } from 'react-icons/fi'
import { AddExpenseModal } from './AddExpenseModal'
import type { ExpenseCategory } from './types'

import {
	DndContext,
	DragOverlay,
	MouseSensor,
	TouchSensor,
	closestCenter,
	useSensor,
	useSensors,
	type DragEndEvent,
	type DragStartEvent,
} from '@dnd-kit/core'
import {
	SortableContext,
	useSortable,
	verticalListSortingStrategy,
	arrayMove,
	defaultAnimateLayoutChanges,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

type SortableExpenseItemProps = {
	item: ExpenseCategory
	onOpen: (item: ExpenseCategory) => void
	onDelete: (id: string) => void
}

type ExpenseRowProps = {
	item: ExpenseCategory
	onOpen: (item: ExpenseCategory) => void
	onDelete: (id: string) => void
	dragHandleProps?: Record<string, unknown>
	isDragging?: boolean
	isOverlay?: boolean
}

const ExpenseRow = ({
	item,
	onOpen,
	onDelete,
	dragHandleProps,
	isDragging = false,
	isOverlay = false,
}: ExpenseRowProps) => {
	return (
		<div
			onClick={() => {
				if (!isOverlay) onOpen(item)
			}}
			className='flex items-center justify-between rounded-sm border bg-white px-4 py-2 text-lg cursor-pointer shadow-sm transition hover:shadow-md'
			style={{
				opacity: isDragging && !isOverlay ? 0.35 : 1,
			}}
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

const SortableExpenseItem = ({
	item,
	onOpen,
	onDelete,
}: SortableExpenseItemProps) => {
	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({
		id: item.id,
		animateLayoutChanges: args => defaultAnimateLayoutChanges(args),
	})

	const style = {
		transform: CSS.Transform.toString(transform),
		transition: transition || 'transform 280ms cubic-bezier(0.22, 1, 0.36, 1)',
	}

	return (
		<div ref={setNodeRef} style={style}>
			<ExpenseRow
				item={item}
				onOpen={onOpen}
				onDelete={onDelete}
				isDragging={isDragging}
				dragHandleProps={{
					...attributes,
					...listeners,
				}}
			/>
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
	const [activeId, setActiveId] = useState<string | null>(null)

	const total = getTotal()

	const sensors = useSensors(
		useSensor(MouseSensor, {
			activationConstraint: {
				distance: 8,
			},
		}),
		useSensor(TouchSensor, {
			activationConstraint: {
				delay: 180,
				tolerance: 8,
			},
		}),
	)

	const activeItem = useMemo(
		() => expenses.find(item => item.id === activeId) ?? null,
		[expenses, activeId],
	)

	const handleDelete = (id: string) => {
		if (!window.confirm('Удалить категорию?')) return
		removeCategory(id)
	}

	const handleReset = () => {
		if (!window.confirm('Вы уверены? Все суммы расходов будут сброшены.'))
			return
		resetAll()
	}

	const handleDragStart = (event: DragStartEvent) => {
		setActiveId(String(event.active.id))
	}

	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event

		setActiveId(null)

		if (!over || active.id === over.id) return

		const oldIndex = expenses.findIndex(item => item.id === active.id)
		const newIndex = expenses.findIndex(item => item.id === over.id)

		if (oldIndex === -1 || newIndex === -1) return

		const newOrder = arrayMove(expenses, oldIndex, newIndex)
		reorderExpenses(newOrder)
	}

	return (
		<div className='space-y-4 pb-28'>
			<div className='w-full flex justify-end mt-4'>
				<button className='bg-black text-white text-xl font-bold py-1 px-5 rounded-xl'>
					{`- ${total.toLocaleString('ru-RU')}`}
				</button>
			</div>

			<DndContext
				sensors={sensors}
				collisionDetection={closestCenter}
				onDragStart={handleDragStart}
				onDragEnd={handleDragEnd}
				onDragCancel={() => setActiveId(null)}
			>
				<SortableContext
					items={expenses.map(item => item.id)}
					strategy={verticalListSortingStrategy}
				>
					<div className='space-y-2'>
						{expenses.map(item => (
							<SortableExpenseItem
								key={item.id}
								item={item}
								onOpen={item => {
									setSelectedCategory(item)
									setOpenAdd(true)
								}}
								onDelete={handleDelete}
							/>
						))}
					</div>
				</SortableContext>

				<DragOverlay
					dropAnimation={{
						duration: 280,
						easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
					}}
				>
					{activeItem ? (
						<ExpenseRow
							item={activeItem}
							onOpen={() => {}}
							onDelete={handleDelete}
							isOverlay
						/>
					) : null}
				</DragOverlay>
			</DndContext>

			<Button
				variant='outline'
				className='w-fit bg-black text-white rounded-xl shadow-2xl'
				onClick={handleReset}
			>
				Сбросить все расходы
			</Button>

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
		</div>
	)
}
