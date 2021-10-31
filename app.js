// Fichier contenant la logique globale de notre API

// import d'express après l'avoir installé avec npm install --save express
const express = require('express')
// import de mongoose après l'avoir installé avec npm install --save mongoose
// Mongoose est un package qui facilite les interactions avec notre base de données MongoDB 
// grâce à des fonctions extrêmement utiles 
const mongoose = require('mongoose')


const path = require("path")



// Connexion de mongoose à notre base de données MongoDB
mongoose.connect('mongodb+srv://David_Alleaume:cestmoidavid@cluster0.idrhn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'))

const app = express()

// Middleware qui concerne toutes les routes et qui ajoute des headers à l'objet response pour éviter les 
// problèmes de CORS
app.use((req, res, next) => {
    // on autaorise tout le monde à accéder à notre API
    res.setHeader('Access-Control-Allow-Origin', '*')
    // on autorise certains headers
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization')
    // on autorise certaines methodes
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS')
    next()
});

// Remplace Body-paser et permet de parser les requêtes entrantes
app.use(express.json())

app.use('/images', express.static(path.join(__dirname, 'images')))


// Initialisation du routage
const userRoutes = require('./routes/user')
const sauceRoutes = require('./routes/sauce')

app.use('/api/auth', userRoutes)
app.use('/api/sauces', sauceRoutes)

// on exporte notre application express pour y avoir accès depuis les autres dossier
// notemment depuis notre serveur Node
module.exports = app