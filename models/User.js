const { Schema, model, Types } = require('mongoose');
const moment = require('moment');

const UserSchema = new Schema({

})

const User = model('User', UserSchema);

module.exports = User;