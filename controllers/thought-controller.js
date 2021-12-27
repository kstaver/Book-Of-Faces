const { User, Thought } = require('../models');

const thoughtController = {

    // Get all thoughts or posts
    getAllThoughts(req, res){
        Thought.find({})
        .then(dbThoughtData => res.json(dbThoughtData))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        })
    },

    // Get a thought or post by id
    getThoughtById({ params }, res) {
        Thought.findOne({ _id: params.id })
        .populate({ path: 'reactions', select: '-__v' })
        .select('-__v')
        .sort({ id: -1 })
        .then(dbThoughtData => {
            if (!dbThoughtData){
                res.status(404).json({message: 'This thought does not exist.'});
                return;
            }
            res.json(dbThoughtData)
        })
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        })
    },

    // Create a thought or post
    createThought({ params, body }, res) {
        Thought.create(body)
        .then(({ _id }) => {
            return User.findOneAndUpdate(
                { _id: params.userId},
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
    
    // Update thoughts or posts
    updateThought({ params, body }, res){
        Thought.findOneAndUpdate(
            { _id: params.id }, body)
           // { new: true, runValidators: true }
        .then(dbThoughtData => {
            if(!dbThoughtData){
                return res.status(404).json({ message: 'No thought found with this ID!' });
            }
            res.json(dbThoughtData);
        })
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        })
    },
    
    // Delete a thought or post
    deleteThought({ params }, res){
        Thought.findOneAndDelete({_id: params.thoughtId})
        .then(deletedThought => {
            
            if(!deletedThought) {
                res.status(404).json({message: "No thought with this id found!"})
                return;
            }
                return User.findOneAndUpdate(
                {_id: params.userId},
                {$pull: {thoughts:params.thoughtId}},
                {new: true}
            )
        })
        .then(dbUserData => {
            console.log(dbUserData)
            if(!dbUserData) {
                res.status(404).json({message: 'No User with this id found'});
                return;
            }
            res.json(dbUserData);
        })
        .catch(err=> res.json(err));
    },

    // Add a reaction
    addReaction({ params, body }, res){
        Thought.findOneAndUpdate(
            { _id: params.thoughtId },
            { $push: { reactions: body } },
            { new: true, runValidators: true }
        )
        .then(dbThoughtData => {
            if(!dbThoughtData){
                res.status(404).json({ message: 'No thought found with this id'});
                return;
            }
            res.json(dbThoughtData);
        })
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        })
    },

    // Remove a reaction
    removeReaction({ params }, res){
        Thought.findOneAndUpdate(
            { _id: params.thoughtId },
            { $pull: { reactions: { reactionId: params.reactionId } } },
            { new: true } 
        )
        .then(dbUserData => res.json(dbUserData))
        .catch(err => res.json(err));
    }
};

module.exports = thoughtController;