export class List {
	title: string;
	id: Number;
	posts: Post[];
	owner: string;
	constructor(title: string, listId: Number, owner: string) {
		this.title = title;
		this.id = listId;
		this.owner = owner;
		this.posts = []
	}
}


export class Post {
	id: Number;
	title: string;
	text: string;
	constructor(id: Number, title: string, text: string) {
		this.title = title;
		this.id = id;
		this.text = text;
	}
}


export class FullPost extends Post {
	commentaries: Commentary[];
	constructor(id: Number, 
				title: string, 
				text: string) {
		super(id, title, text);
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