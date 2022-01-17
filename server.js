const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use(require('./routes'));

const db = process.env.MONGODB_URL;

mongoose.connect(db || 'mongodb://localhost/book-of-faces',{
    useNewUrlParser: true,
    useUnifiedTopology: true
    }, err =>{
        if(err) throw err;
        console.log('Connected to MongoDB.');
    }
);

mongoose.set('debug', true);

app.listen(PORT, () => console.log('Connected to localhost:${PORT}'));