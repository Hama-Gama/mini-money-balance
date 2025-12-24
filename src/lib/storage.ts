// Универсальные функции для работы с localStorage
// Без привязки к конкретным фичам

export const storage = {
	get<T>(key: string, fallback: T): T {
		if (typeof window === 'undefined') return fallback

		try {
			const raw = localStorage.getItem(key)
			return raw ? (JSON.parse(raw) as T) : fallback
		} catch {
			return fallback
		}
	},

	set<T>(key: string, value: T) {
		if (typeof window === 'undefined') return

		try {
			localStorage.setItem(key, JSON.stringify(value))
		} catch {
			// можно логировать ошибку
		}
	},

	remove(key: string) {
		if (typeof window === 'undefined') return
		localStorage.removeItem(key)
	},

	clear() {
		if (typeof window === 'undefined') return
		localStorage.clear()
	},
}
