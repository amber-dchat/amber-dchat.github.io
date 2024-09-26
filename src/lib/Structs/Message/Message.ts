import { db } from '@/hooks/user/useMainUser';
import { getUser } from '@/lib/utils/Gun/Users/getUser';

export type MessageStructure = {
	content: string;
	by: string;
	timestamp: string;
};

export class Message {
	content: string;
	author: string;
	timestamp: Date;

	constructor(d: MessageStructure) {
		const isoArr = d.timestamp.split("/")
		const iso = isoArr[isoArr.length - 1]

		this.content = d.content;
		this.author = d.by; // saving ******some****** bytes i guess?
		this.timestamp = new Date(iso)
	}

	transform() {
		return getUser(this.author, db);
	}
}
