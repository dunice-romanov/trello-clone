export class List {
	title: string;
	id: Number;
	posts: Post[];
	
	constructor(title: string, listId: Number) {
		this.title = title;
		this.id = listId;
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