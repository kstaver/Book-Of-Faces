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

    },
    // Add a reaction
    addReaction({ params, body }, res){

    },
    // Remove a reaction
    removeReaction({ params }, res){

    },
    // Update thoughts or posts
    updateThought({ params, body }, res){

    },
    // Delete a thought or post
    deleteThought({ params, body }, res){
        
    }
};

module.exports = thoughtController;