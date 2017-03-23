export class User {
    username: string;
    password: string;
    
    constructor(username: string, password: string) {
    	this.password = password;
    	this.username = username;
    }
}

export class UserInfo {
	id: number;
	username: string;
	firstName: string;
	lastName: string;
	bio: string;
	email: string;
	constructor(id: number, 
				username: string, 
				firstName: string, 
				lastName: string, 
				bio: string,
				email: string) {
		this.id = id;
		this.username = username;
		this.firstName = firstName;
		this.lastName = lastName;
		this.bio = bio;
		this.email = email;
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