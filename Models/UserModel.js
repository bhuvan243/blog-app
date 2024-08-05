const UserSchema = require("../Schemas/UserSchema");
const bcrypt = require("bcryptjs");

const User = class {
	constructor({ name, email, username, password }) {
		this.name = name;
		this.email = email;
		this.username = username;
		this.password = password;
	}

	userRegistration() {
		// Implement registration logic here
		return new Promise(async (resolve, reject) => {
			// hashing password
			const hashedPassword = await bcrypt.hash(
				this.password,
				Number(process.env.SALT),
			);

			// create an  userSchema obj to save() in db
			const userSchemaObj = new UserSchema({
				name: this.name,
				email: this.email,
				username: this.username,
				password: hashedPassword,
			});

			try {
				const userObj = userSchemaObj.save();
				resolve(userObj);
			} catch (error) {
				reject(error);
			}
		});
	}

	// check if user already exists
	emailAndUsernameExist() {
		return new Promise(async (resolve, reject) => {
			try {
				const userDb = await UserSchema.findOne({
					$or: [{ email: this.email }, { username: this.username }],
				});

				if (userDb && userDb.email === this.email)
					reject("Email already exists");
				if (userDb && userDb.username === this.username)
					reject("Username already exists");
				// if there is no problem, just resolve
				resolve();
			} catch (error) {
				reject(error);
			}
		});
	}

	// for login -> check for user present or not
	static findUserWithKey({ loginId }) {
		return new Promise(async (resolve, reject) => {
			try {
				// here user could have used email/username to login - possible, so check for both
				const userDb = await UserSchema.findOne({
					$or: [{ email: loginId }, { username: loginId }],
				}).select("+password");

				if (!userDb) reject("User not found");
				resolve(userDb);
			} catch (error) {
				reject(error);
			}
		});
	}
};

module.exports = User;
