import type { Tab } from '@/types/tab'

type Props = {
	activeTab: Tab
	onChange: (tab: Tab) => void
}

const tabs: { id: Tab; label: string; icon: string }[] = [
	{ id: 1, label: 'Расходы', icon: '📉' },
	{ id: 2, label: 'Доходы', icon: '💰' },
	{ id: 3, label: 'Кредиты', icon: '💳' },
	{ id: 4, label: 'Сбережения', icon: '🏦' },
	{ id: 5, label: 'Аналитика', icon: '📊' },
]

export const BottomNavigationBar = ({ activeTab, onChange }: Props) => {
	return (
		<div
			className='
        fixed
        bottom-0
        left-0
        right-0
        bg-white
        border-t
        flex
        justify-around
        py-2
        z-50
				max-w-[700px]
				m-auto
      '
		>
			{tabs.map(tab => {
				const isActive = activeTab === tab.id

				return (
					<button
						key={tab.id}
						onClick={() => onChange(tab.id)}
						className={`
              flex
              flex-col
              items-center
              text-xs
              transition
              ${isActive ? 'text-black font-semibold' : 'text-muted-foreground'}
            `}
					>
						<span className='text-lg'>{tab.icon}</span>
						<span>{tab.label}</span>
					</button>
				)
			})}
		</div>
	)
}
