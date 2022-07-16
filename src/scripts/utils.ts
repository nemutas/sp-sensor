export const publicPath = (path: string) => {
	const p = path.startsWith('/') ? path.substring(1) : path
	return import.meta.env.BASE_URL + p
}

export const getExtension = (path: string) => {
	const s = path.split('.')
	return s[s.length - 1]
}
