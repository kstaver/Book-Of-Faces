const { Thought, User } = require('../models');

const thoughtController = {

    // Get all thoughts or posts
    getAllThoughts: (req, res) =>{
        Thought.find({})
        .populate({ path: 'user', select: '-__v'})
        .then(dbThoughtData => res.json(dbThoughtData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        })
    },

    // Get a thought or post by id
    getThoughtByID:({ params }, res) => {
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
    createThought: (req, res) => {

    }
    // Add a reaction
    // Remove a reaction
    // Update thoughts or posts
    // Delete a thought or post
};

module.exports = thoughtController;