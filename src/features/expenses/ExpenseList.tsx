import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useExpensesStore } from '@/features/expenses/expenses.store'
import { FiPlus } from 'react-icons/fi'
import { AddExpenseModal } from './AddExpenseModal'
import type { ExpenseCategory } from './types'

import {
	DndContext,
	PointerSensor,
	closestCenter,
	useSensor,
	useSensors,
	type DragEndEvent,
} from '@dnd-kit/core'
import {
	SortableContext,
	useSortable,
	verticalListSortingStrategy,
	arrayMove,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

type SortableExpenseItemProps = {
	item: ExpenseCategory
	onOpen: (item: ExpenseCategory) => void
	onDelete: (id: string) => void
}

const SortableExpenseItem = ({
	item,
	onOpen,
	onDelete,
}: SortableExpenseItemProps) => {
	const { attributes, listeners, setNodeRef, transform, transition } =
		useSortable({ id: item.id })

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	}

	return (
		<div
			ref={setNodeRef}
			style={style}
			onClick={() => onOpen(item)}
			className='flex items-center justify-between rounded-sm border bg-white px-4 py-2 text-lg cursor-pointer shadow-sm transition hover:shadow-md last:mb-[50px]'
		>
			<div
				{...attributes}
				{...listeners}
				onClick={e => e.stopPropagation()}
				className='mr-3 cursor-grab select-none text-zinc-400 active:cursor-grabbing'
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

	const total = getTotal()

	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: {
				distance: 8,
			},
		}),
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

	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event

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
				onDragEnd={handleDragEnd}
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
