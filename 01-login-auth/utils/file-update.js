import fs from "fs";

const updateUsers = (path, userData) => {

	const fileData = fs.readFileSync(path);

	const dataObject = JSON.parse(fileData);

	dataObject["users"].push(userData)

	console.log(userData)

	fs.writeFileSync(path, JSON.stringify(dataObject))
}

export default updateUsers;