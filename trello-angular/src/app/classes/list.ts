export class List {
	title: string;
	id: number;
	posts: Post[];
	owner: string;
	constructor(title: string, listId: number, owner: string) {
		this.title = title;
		this.id = listId;
		this.owner = owner;
		this.posts = []
	}
}


export class Post {
	id: number;
	positionId: number;
	title: string;
	text: string;
	constructor(id: number, title: string, 
				text: string, positionId: number) {
		this.title = title;
		this.id = id;
		this.text = text;
		this.positionId = positionId;
	}
}


export class FullPost extends Post {
	commentaries: Commentary[];
	constructor(id: number, 
				title: string, 
				text: string,
				positionId: number) {
		super(id, title, text, positionId);
		this.commentaries = [];
	}
}


export class Commentary {
	username: string;
	text: string;
	created: Date;

	constructor(username: string, 
				text: string, 
				created: Date) {
		this.username = username;
		this.text = text;
		this.created = created;
	}
}