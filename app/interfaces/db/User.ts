interface User {
	_id?: string,
	emailVerified?: string,
	name: string,
	email: string,
	image: string,
	favorites: string[],
	roadmaps: string[]
};

export default User;