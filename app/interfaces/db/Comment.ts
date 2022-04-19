import { Types } from 'mongoose';

import User from './User';

interface Comment {
	_id: string,
	content: string,
	author: User,
	timestamp: string,
	parent?: Types.ObjectId
};

export default Comment;