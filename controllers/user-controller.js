const { User, Thought } = require('../models');

const userController = {

    // Get all users
    getAllUsers(req,res){
        User.find({})
        .populate({
            path: 'thoughts',
            select: '-__v'
        })
        .sort({ _id: -1 })
        .populate({
            path: 'friends',
            select: '-__v'
        })
        .sort({ _id: -1 })
        .then(dbUserData => res.json(dbUserData))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
    },

    // Get user by id
    getUserById({ params }, res) {
        User.findOne({ _id: params.id })
        .populate({
            path: 'thoughts',
            select: '-__v'
        })       
        .sort({ _id: -1 })
        .populate({
            path: 'friends',
            select: '-__v'
        })
        .sort({ _id: -1 })
        .then(dbUserData => {
            if(!dbUserData){
                res.status(404).json({message: 'This user does not exist!'})
                return;
            }
            res.json(dbUserData)
        })
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
    },

    // Create user
    createUser({ body }, res) {
        User.create(body)
        .then(dbUserData => res.json(dbUserData))
        .catch(err => res.json(err));
    },

    // Update user
    updateUser({ params, body }, res){
        User.findOneAndUpdate(
            { _id: params.id },
            body,
            { new: true, runValidators: true}
        )
        .then(dbUserData => {
            if(!dbUserData) {
                res.status(404).json({ message: 'No user found with this ID!' });
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => res.json(err));
    },

    // Delete a user
    deleteUser({ params }, res){
        User.findOneAndDelete({ _id:params.id })
        .then(deletedUser => {
            if(!deletedUser){
                res.status(404).json({message: 'This user does not exist!'});
                return;
            }
            return Thought.deleteMany({_id: {$in: deletedUser.thoughts }})

        })
        .then(dbUserData=>{
            if(!dbUserData){
                res.status(404).json({message: 'This user does not exist!'});
                return;
            }
            res.json(dbUserData);
        })
        .catch(err=> res.json(err));
    },
    
    // Add a friend
    addFriend({ params, body }, res){
        User.findOneAndUpdate(
            { _id: params.id },
            { $push: { friends: body} },
            { new: true, runValidators: true }
        )
        .then(dbThoughtData => {
            if(!dbThoughtData) {
                res.status(404).json({ message: 'No user found with this ID!' });
                return;
            }
            res.json(dbThoughtData);
        })
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        })
    },

    removeFriend(req, res) {
        User.findOneAndUpdate(
            { _id: req.params.userId }, 
            { $pull: { friends: req.params.friendId } },
            { new: true })
          .then((dbUserData) => {
            if (!dbUserData) {
              return res.status(404).json({ message: 'No user with this id!' });
            }
            res.json(dbUserData);
          })
          .catch((err) => {
            console.log(err);
            res.status(500).json(err);
          });
    }
};

module.exports = userController;