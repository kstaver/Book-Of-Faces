const { Schema, model } = require('mongoose');
/*const moment = require('moment');
const Thought = require('./Thought.js');*/

const UserSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        email:{
            type: String,
            required: true,
            unique: true,
            trim: true,
            match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email address.']
        },
        thoughts: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Thought'
            }
        ],
        friends: [
            {
                type: Schema.Types.ObjectId,
                ref: 'User'
            }
        ]
    },
    {
        toJSON:{
            virtuals: true,
            //getters: true
        },
        id: false
    }
);

UserSchema.virtual('friendCount').get(function(){
    return this.friends.length;
});

/*UserSchema.virtual('thoughtCount').get(function () {
    console.log(this.thoughts);
    console.log(this.thoughts.length);
    return this.thoughts.length;
});*/

const User = model('User', UserSchema);

module.exports = User;