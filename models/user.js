// création d'un modèle "user" avec la fonction shéma de mongoose contenant les données requises pour chaque utilisateur

// import de mongoose
const mongoose = require('mongoose')

// import de unique validator (après installation avec npm install --save mongoose-unique-validator)
// pour s'assurer que deux utilisateurs ne peuvent pas utiliser la même adresse e-mail
const uniqueValidator = require('mongoose-unique-validator')

const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
})

userSchema.plugin(uniqueValidator)


// export de ce shéma en tant que model mongoose utilisable par notre application express
module.exports = mongoose.model('User', userSchema)