export class User {
    username: string;
    password: string;
    
    constructor(username: string, password: string) {
    	this.password = password;
    	this.username = username;
    }
}

export class UserToken {
	username: string;
	token: string;

	constructor(username: string, token: string) {
		this.token = token;
		this.username = username;
	}
}