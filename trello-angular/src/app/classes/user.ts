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
	urlAvatar: string;
	constructor(id: number, 
				username: string, firstName: string, lastName: string, 
				bio: string, email: string, urlAvatar: string) {
		this.id = id;
		this.username = username;
		this.firstName = firstName;
		this.lastName = lastName;
		this.bio = bio;
		this.email = email;
		this.urlAvatar = urlAvatar;
	}

	getObject() {
		let obj = {
			'id': this.id,
			'username': this.username,
			'first_name': this.firstName,
			'last_name': this.lastName,
			'bio': this.bio,
			'email': this.email,
		}
		return obj;
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