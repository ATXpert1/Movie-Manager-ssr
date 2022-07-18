const mongoose = require('mongoose');

let usersSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
    },
    password: {
        type: String,
    }
})

usersSchema.statics.login = async function (username, password) {
    let user = await this.findOne({ username: username });
    if (user) {
        if (user.password === password) {
            return user;
        }
        else {
            return false;
        }
    }
    else {
        return false;
    }
}

module.exports = mongoose.model('users', usersSchema);
