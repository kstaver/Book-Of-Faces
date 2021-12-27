const { Schema, model, Types } = require('mongoose');
const moment = require('moment');

const ReactionSchema = new Schema(
    {
        reactionId:{
            type: Schema.Types.ObjectId,
            default: () => new Types.ObjectId()
        },
        reactionBody:{
            type: String,
            required: true,
            trim: true,
            minlength: 1,
            maxlength: 200
        },
        username: {
            type: String,
            required: true,
        },
        userId: {
            type: String,
            required: true
        },
        createdAt: {
            type: Date,
            default: Date.now,
            get: createdAtVal => moment(createdAtVal).format('MMMM DD, YYYY [a] hh:mm a')
        }
    },
    {
    toJSON:{
        getters: true
    },
    id: false
});

const ThoughtSchema = new Schema(
    {
        thoughtText: {
            type: String,
            required: true,
            minlength: 1,
            maxlength: 200
        },
        createdAt: {
            type: Date,
            default: Date.now,
            get: createdAtVal => moment(createdAtVal).format('MMMM DD, YYYY [a] hh:mm a')
        },
        reactions: [ReactionSchema],
        username: {
            type: String,
            required: true,
            userId: {
                type: String,
                required: true
            }
        },

    },
    {
        toJSON:{
            virtuals: true,
            getters: true
        },
    }
);

ThoughtSchema.virtual('reactionCount').get(function(){
    return this.reactions.length;
});

const Thought = model('Thought', ThoughtSchema);

module.exports = Thought;