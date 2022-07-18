const jsonfile = require('jsonfile');

const getUsers = () => {
    return new Promise((resolve, reject) => {
        jsonfile.readFile(__dirname + '/../jsonFiles/users.json', (err, data) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(data);
            }
        })
    })
}
const addUser = (newUser) => {

    return new Promise((resolve, reject) => {
        jsonfile.readFile(__dirname + '/../jsonFiles/users.json', (err, users) => {
            if (err) {
                reject(err);
            }
            else {
                {
                    users.push(newUser);
                    jsonfile.writeFile(__dirname + '/../jsonFiles/users.json', users, (err) => {
                        if (err) {
                            reject(err);
                        }
                        else {
                            resolve("success");
                        }
                    })
                }
            }
        })
    })
}
const editUser = (id, userData) => {
    return new Promise((resolve, reject) => {
        jsonfile.readFile(__dirname + '/../jsonFiles/users.json', (err, users) => {
            if (err) {
                reject(err);
            }
            else {
                let userIndex = users.findIndex(user => user.id == id);
                users[userIndex] = { ...users[userIndex], firstName: userData.firstName, lastName: userData.lastName, sessionTimeOut: userData.sessionTimeOut };
                jsonfile.writeFile(__dirname + '/../jsonFiles/users.json', users, (err) => {
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
        jsonfile.readFile(__dirname + '/../jsonFiles/users.json', (err, users) => {
            if (err) {
                reject(err);
            }
            else {
                let userIndex = users.findIndex(user => user.id == id);
                users.splice(userIndex, 1);
                jsonfile.writeFile(__dirname + '/../jsonFiles/users.json', users, (err) => {
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
module.exports = { getUsers, addUser, editUser, deleteUser };