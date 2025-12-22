export const Header = () => {
	const date = new Date()

	// день месяца (1–31)
	const dayOfMonth = date.getDate()

	// неделя месяца (1–5)
	const weekNumber = Math.ceil(dayOfMonth / 7)

	return (
		<div className='flex items-center justify-between border-b pb-2'>
			<div className='text-lg font-semibold'>{weekNumber}</div>

			<div className='text-base text-muted-foreground'>
				{date.toLocaleDateString('ru-RU', {
					weekday: 'short',
					day: 'numeric',
					month: 'long',
					year: 'numeric',
				})}
			</div>
		</div>
	)
}
