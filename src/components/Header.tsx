type Props = {}

export const Header = ({}: Props) => {
	const date = new Date()
	const dayOfMonth = date.getDate()
	const weekNumber = Math.ceil(dayOfMonth / 7)

	return (
		<div className='fixed top-0 left-0 right-0 z-50 bg-zinc-100 border-b'>
			<div className='max-w-md mx-auto px-3 py-4 flex items-center justify-between'>
				<div className='w-7 h-7 flex items-center justify-center bg-black rounded-full text-white font-semibold'>
					{weekNumber}
				</div>

				<div className='text-lg text-black'>
					{date.toLocaleDateString('ru-RU', {
						weekday: 'long',
						day: 'numeric',
						month: 'long',
						year: 'numeric',
					})}
				</div>
			</div>
		</div>
	)
}
