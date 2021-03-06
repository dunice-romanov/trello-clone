export class Board {
	title: string;
	accessLevel: string;
	boardOwner: string;
	id: Number;
	constructor(title: string, 
				accessLevel: string, 
				boardOwner: string,
				id: Number) {
		this.accessLevel = accessLevel;
		this.boardOwner = boardOwner;
		this.title = title;
		this.id = id;
	}
}

export class ShareBoard {
	id: number;
	username: string;
	accessLevel: string;
	boardId: number;
	title: string;
	constructor(id: number,
				username: string, 
				accessLevel: string,
				boardId: number,
				title: string) {
		this.id = id;
		this.accessLevel = accessLevel;
		this.boardId = boardId;
		this.username = username;
		this.title = title;
	}
}