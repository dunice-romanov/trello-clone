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
	title: string;
	id: Number;

	constructor(title, id) {
		this.title = title;
		this.id = id;
	}
}