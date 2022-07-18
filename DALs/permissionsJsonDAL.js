const jsonfile = require('jsonfile');

const getPermissions = () => {
    return new Promise((resolve, reject) => {
        jsonfile.readFile(__dirname + '/../jsonFiles/permissions.json', (err, users) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(users);
            }
        })
    })
}
const addUser = (user) => {
    return new Promise((resolve, reject) => {
        jsonfile.readFile(__dirname + '/../jsonFiles/permissions.json', (err, users) => {
            if (err) {
                reject(err);
            }
            else {
                users.push(user);
                jsonfile.writeFile(__dirname + '/../jsonFiles/permissions.json', users, (err) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve("success")
                    }
                })
            }
        })
    })
}
const editUser = (id, permissions) => {
    return new Promise((resolve, reject) => {
        jsonfile.readFile(__dirname + '/../jsonFiles/permissions.json', (err, users) => {
            if (err) {
                reject(err);
            }
            else {
                let userIndex = users.findIndex(user => user.id == id);
                users[userIndex].permissions = permissions;
                jsonfile.writeFile(__dirname + '/../jsonFiles/permissions.json', users, (err) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve("success")
                    }
                })
            }
        })
    })
}
const deleteUser = (id) => {
    return new Promise((resolve, reject) => {
        jsonfile.readFile(__dirname + '/../jsonFiles/permissions.json', (err, users) => {
            if (err) {
                reject(err);
            }
            else {
                let userIndex = users.findIndex(user => user.id == id);
                users.splice(userIndex, 1);
                jsonfile.writeFile(__dirname + '/../jsonFiles/permissions.json', users, (err) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve('success')
                    }
                })
            }
        })
    })
}
module.exports = { getPermissions, addUser, editUser, deleteUser };