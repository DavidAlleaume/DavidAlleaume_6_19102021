// création d'un Shéma "user" avec mongoose contenant les données requises pour chaque utilisateur

const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
})

userSchema.plugin(uniqueValidator)


// export de ce shéma en tant que model mongoose utilisable par notre application express
module.exports = mongoose.model('User', userSchema)