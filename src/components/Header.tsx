type Props = {}

export const Header = ({}: Props) => {
	const date = new Date()
	const dayOfMonth = date.getDate()
	const weekNumber = Math.ceil(dayOfMonth / 7)

	return (
		<div className='border-b pb-6 pt-2'>
			<div className='flex items-center justify-between'>
				<div className='w-7 h-7 flex items-center justify-center rounded-full bg-black text-white font-semibold'>
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
