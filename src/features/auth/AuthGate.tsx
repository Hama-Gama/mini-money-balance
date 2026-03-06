import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'

type Props = {
	children: React.ReactNode
}

export const AuthGate = ({ children }: Props) => {
	const [loading, setLoading] = useState(true)
	const [isAuthed, setIsAuthed] = useState(false)

	useEffect(() => {
		// 1) проверяем сессию при старте
		supabase.auth.getSession().then(({ data }) => {
			setIsAuthed(!!data.session)
			setLoading(false)
		})

		// 2) слушаем изменения авторизации
		const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
			setIsAuthed(!!session)
		})

		return () => {
			sub.subscription.unsubscribe()
		}
	}, [])

	const signIn = async () => {
		await supabase.auth.signInWithOAuth({
			provider: 'google',
			options: {
				// можно не указывать redirectTo — Supabase сам обработает
				// но если нужно:
			  redirectTo: window.location.origin,
			},
		})
	}

	if (loading) return null

	// ✅ Важно: если оффлайн — показываем приложение и без логина
	// (чтобы работало без интернета)
	const isOffline = !navigator.onLine
	if (isOffline) return <>{children}</>

	if (!isAuthed) {
		return (
			<div className='min-h-[60vh] flex flex-col items-center justify-center gap-4 p-4'>
				<div className='text-xl font-bold'>Вход</div>
				<div className='text-sm text-muted-foreground text-center max-w-sm'>
					Один раз войди через Google — дальше вход не будет спрашиваться.
					Оффлайн режим работает без входа.
				</div>
				<Button onClick={signIn} className='w-full max-w-sm'>
					Войти через Google
				</Button>
			</div>
		)
	}

	return <>{children}</>
}
