// création d'un Shéma "sauce" avec mongoose contenant les données requises pour chaque sauces

const mongoose = require('mongoose')

const sauceSchema = mongoose.Schema({
    userId: { type: String, required: true },
    name: { type: String, required: true },
    manufacturer: { type: String, required: true },
    description: { type: String, required: true },
    mainPepper: { type: String, required: true },
    imageUrl: { type: String, required: true },
    heat: { type: Number, required: true },
    likes: { type: Number, required: true },
    dislikes: { type: Number, required: true },
    usersLiked: { type: [String], required: true },
    usersDisliked: { type: [String], required: true },
})

// export de ce shéma en tant que model mongoose utilisable par notre application express
module.exports = mongoose.model('Sauce', sauceSchema)