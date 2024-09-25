import { db } from '@/hooks/user/useMainUser';
import { getUser } from '@/lib/utils/Gun/Users/getUser';

export type MessageStructure = {
	content: string;
	by: string;
};

export class Message {
	content: string;
	author: string;

	constructor(d: MessageStructure) {
		this.content = d.content;
		this.author = d.by; // saving ******some****** bytes i guess?
	}

	transform() {
		return getUser(this.author, db);
	}
}
