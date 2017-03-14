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