export class List {
	title: string;
	id: number;
	posts: Post[];
	constructor(title: string, listId: number) {
		this.title = title;
		this.id = listId;
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

	private months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
					  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

	constructor(username: string, 
				text: string, 
				created: Date) {
		this.username = username;
		this.text = text;
		this.created = created;
	}

	getDate(): string {
		
		let day: string = "" + this.created.getDate();
		let month: string = this.months[this.created.getMonth()];
		let year: string = "" + (this.created.getFullYear());
		let minutes_ = this.created.getMinutes();
		let minutes: string = minutes_ < 10 ? '0' + minutes_ : "" + minutes_; 
		let hours_ = this.created.getHours();
		let hours: string = hours_ < 10 ? '0' + hours_ : "" + hours_; 
		return `${hours}:${minutes} ${day} ${month} ${year}`
	}

}