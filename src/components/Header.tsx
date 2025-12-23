export const Header = () => {
	const date = new Date()

	// день месяца (1–31)
	const dayOfMonth = date.getDate()

	// неделя месяца (1–5)
	const weekNumber = Math.ceil(dayOfMonth / 7)

	return (
		<div className='flex items-center justify-between border-b pb-2'>
			{/* Номер недели в круге */}
			<div
				className='
          w-6
          h-6
          flex
          items-center
          justify-center
          rounded-full
          bg-black
          text-white
          font-semibold
        '
			>
				{weekNumber}
			</div>

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
