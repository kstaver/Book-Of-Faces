const { Thought, User } = require('../models');

const thoughtController = {

    // Get all thoughts or posts
    getAllThoughts(req, res){
        Thought.find({})
        .populate({ path: 'user', select: '-__v'})
        .then(dbThoughtData => res.json(dbThoughtData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        })
    },

    // Get a thought or post by id
    getThoughtByID({ params }, res) {
        Thought.findOne({ _id: params.id })
        .populate({ path: 'reactions', select: '-__v' })
        .select('-__v')
        .sort({ id: -1 })
        .then(dbThoughtData => res.json(dbThoughtData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        })
    },

    // Create a thought or post
    createThought({ params, body }, res) {
        Thought.create(body)
        .then(({ _id }) => {
            return User.findOneAndUpdate(
                { username: body.username},
                { $push: { thoughts: _id }},
                { new: true }
            );
        })
        .then(dbUserData =>{
            if(!dbUserData){
                res.status(404).json({ message: 'No user found with this username'});
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => res.json(err));
    },

    // Add a reaction
    addReaction({ params, body }, res){
        Thought.findOneAndUpdate(
            { _id: params.thoughtId },
            { $push: { reaction: body } },
            { new: true, runValidators: true }
        )
        .then(dbThoughtData => {
            if(!dbThoughtData){
                res.status(404).json({ message: 'No thought found with this id'});
                return;
            }
            res.json(dbThoughtData);
        })
        .catch(err => res.json(err));
    },

    // Remove a reaction
    removeReaction({ params }, res){
        Thought.findOneAndUpdate(
            { _id: params.thoughtId },
            { $pull: { reactions: { reactionId: params.reactionId } } },
            { new: true } 
        )
        .then(dbThoughtData => res.json(dbThoughtData))
        .catch(err => res.json(err));
    },

    // Update thoughts or posts
    updateThought({ params, body }, res){
        Thought.findOneAndUpdate(
            { _id: params.id },
            body,
            { new: true, runValidators: true }
        )
        .then(updatedThought => {
            if(!updatedThought){
                return res.status(404).json({ message: 'No thought found with this ID!' });
            }
            res.json(updatedThought);
        })
        .catch(err => res.json(err));
    },

    // Delete a thought or post
    deleteThought({ params, body }, res){

    }
};

module.exports = thoughtController;