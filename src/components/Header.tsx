// import type { Tab } from '@/features/expenses/types'
import type { Tab } from '@/types/tab'

type Props = {
	activeTab: Tab
	onChange: (tab: Tab) => void
}

export const Header = ({ activeTab, onChange }: Props) => {
	const date = new Date()
	const dayOfMonth = date.getDate()
	const weekNumber = Math.ceil(dayOfMonth / 7)

	const tabs: { id: Tab; label: string }[] = [
		{ id: 1, label: 'Расходы' },
		{ id: 2, label: 'Доходы' },
		{ id: 3, label: 'Кредиты' },
		{ id: 4, label: 'Сбережения' },
		{ id: 5, label: 'Аналитика' },
	]

	return (
		<div className='space-y-2 border-b pb-2'>
			{/* Верхняя строка */}
			<div className='flex items-center justify-between'>
				<div className='w-6 h-6 flex items-center justify-center rounded-full bg-black text-white font-semibold'>
					{weekNumber}
				</div>

				<div className='text-sm text-muted-foreground'>
					{date.toLocaleDateString('ru-RU', {
						weekday: 'short',
						day: 'numeric',
						month: 'long',
						year: 'numeric',
					})}
				</div>
			</div>

			{/* Tabs */}
			<div className='flex gap-2 w-full'>
				{tabs.map(tab => (
					<button
						key={tab.id}
						onClick={() => onChange(tab.id)}
						className={`
        flex-1
        py-2
        rounded-lg
        text-sm
        font-semibold
        transition
        text-center
        ${
					activeTab === tab.id
						? 'bg-black text-white'
						: 'bg-muted text-muted-foreground hover:bg-muted/80'
				}
      `}
					>
						{tab.id}
					</button>
				))}
			</div>
		</div>
	)
}
