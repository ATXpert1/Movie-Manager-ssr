const usersModel = require('./usersModel');
const permissionsJsonDAL = require('../DALs/permissionsJsonDAL');
const usersJsonDAL = require('../DALs/usersJsonDAL');
const getUsersData = async () => {
    let usersPermissions = await permissionsJsonDAL.getPermissions();
    let usersData = await usersJsonDAL.getUsers();
    let mongodbData = await getUsersFromMongodb();
    let combinedData = [];
    mongodbData.filter(document => document.password).forEach((document) => {
        let userPermissions = usersPermissions.find(user => user.id === document._id.toString());
        let userData = usersData.find(userData => userData.id === document._id.toString())
        if (userPermissions && userData && document) {
            combinedData.push({
                id: document._id.toString(),
                // users Json
                firstName: userData.firstName, lastName: userData.lastName,
                sessionTimeOut: userData.sessionTimeOut, createdDate: userData.createdDate,
                // mongodb
                username: document.username,
                // permissions Json
                permissions: userPermissions.permissions
            })
        }
    })
    return combinedData;
}
const getUsersFromMongodb = () => {
    return new Promise((resolve, reject) => {
        usersModel.find({}, function (err, data) {
            if (err) {
                reject(err);
            }
            else {
                resolve(data);
            }
        })
    })
}
const getUserById = (id) => {
    return new Promise((resolve, reject) => {
        usersModel.findById(id, function (err, data) {
            if (err) {
                reject(err);
            }
            else {
                resolve(data)
            }
        })
    })
}
const createAccount = (username, password) => {
    return new Promise((resolve, reject) => {
        usersModel.findOne({ username: username }, async function (err, user) {
            if (err) {
                reject(err);
            }
            else {
                // if user not already used
                if (user && !user.password) {
                    try {
                        user.password = password;
                        user.save();
                        resolve("success")
                    } catch (err) {
                        reject(err);
                    }
                }
                else {
                    reject("username doesn't exist, or already used");
                }
            }
        })
    })
}
const addNewUser = async (newUser) => {
    let user = new usersModel({
        username: newUser.username
    })
    try {
        let resp = await user.save();
        let today = new Date().toLocaleDateString()
        newUser.id = resp._id.toString();
        let newUserJson = { id: newUser.id.toString(), firstName: newUser.firstName, lastName: newUser.lastName, createdDate: today, sessionTimeOut: 12 };
        let newUserPermissions = { id: newUser.id.toString(), permissions: newUser.permissions };
        await usersJsonDAL.addUser(newUserJson);
        await permissionsJsonDAL.addUser(newUserPermissions);
        return 'success';
    } catch (err) {
        throw err;
    }
}
const editUser = async (id, userData) => {
    let user = await usersModel.findById(id);
    user.username = userData.username;
    try { await user.save() } catch (err) { throw err }
    let status1 = await permissionsJsonDAL.editUser(id, userData.permissions);
    let status2 = await usersJsonDAL.editUser(id, userData);
}
const deleteUser = async (id) => {
    try {
        await usersModel.findByIdAndDelete(id);
        await usersJsonDAL.deleteUser(id);
        await permissionsJsonDAL.deleteUser(id);
    } catch (err) {
        throw err;
    }
}
module.exports = { getUsersData, getUserById, createAccount, addNewUser, editUser, deleteUser };
