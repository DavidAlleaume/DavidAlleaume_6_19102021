const express = require('express');
const mongoose = require('mongoose');

const userRoutes = require('./routes/user');

mongoose.connect('mongodb+srv://David_Alleaume:cestmoidavid@cluster0.idrhn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'))

const app = express();

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use((req, res) => {
    res.json({ message: 'Votre requête a bien été reçue !' });
});

app.use(express.json());

app.use('/api/auth', userRoutes);

module.exports = app;