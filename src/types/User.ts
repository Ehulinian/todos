export type User = {
	uid: string
	email?: string
	displayName?: string
	role: 'admin' | 'viewer'
}
